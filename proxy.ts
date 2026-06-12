import { updateSession, type CookieOptions, type CookieStore } from "@insforge/sdk/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/find-jobs"];
const authRoutes = ["/login"];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.includes(pathname);
}

function createRequestCookieStore(request: NextRequest): CookieStore {
  function setCookie(name: string, value: string): unknown;
  function setCookie(options: { name: string; value: string } & CookieOptions): unknown;
  function setCookie(
    nameOrOptions: string | ({ name: string; value: string } & CookieOptions),
    value?: string,
  ): unknown {
    if (typeof nameOrOptions === "string") {
      request.cookies.set(nameOrOptions, value ?? "");
      return undefined;
    }

    request.cookies.set(nameOrOptions.name, nameOrOptions.value);
    return undefined;
  }

  function deleteCookie(name: string): unknown;
  function deleteCookie(options: { name: string } & CookieOptions): unknown;
  function deleteCookie(nameOrOptions: string | ({ name: string } & CookieOptions)): unknown {
    request.cookies.delete(
      typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name,
    );
    return undefined;
  }

  return {
    get: (name: string) => request.cookies.get(name)?.value,
    set: setCookie,
    delete: deleteCookie,
  };
}

function createResponseCookieStore(response: NextResponse): CookieStore {
  function setCookie(name: string, value: string, options?: CookieOptions): unknown;
  function setCookie(options: { name: string; value: string } & CookieOptions): unknown;
  function setCookie(
    nameOrOptions: string | ({ name: string; value: string } & CookieOptions),
    value?: string,
    options?: CookieOptions,
  ): unknown {
    if (typeof nameOrOptions === "string") {
      response.cookies.set({
        name: nameOrOptions,
        value: value ?? "",
        ...options,
      });
      return undefined;
    }

    response.cookies.set(nameOrOptions);
    return undefined;
  }

  function deleteCookie(name: string): unknown;
  function deleteCookie(options: { name: string } & CookieOptions): unknown;
  function deleteCookie(nameOrOptions: string | ({ name: string } & CookieOptions)): unknown {
    response.cookies.delete(
      typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name,
    );
    return undefined;
  }

  return {
    get: (name: string) => response.cookies.get(name)?.value,
    set: setCookie,
    delete: deleteCookie,
  };
}

function redirectWithCookies(url: URL, sourceResponse: NextResponse): NextResponse {
  const redirectResponse = NextResponse.redirect(url);

  for (const cookie of sourceResponse.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  return redirectResponse;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request });

  const session = await updateSession({
    requestCookies: createRequestCookieStore(request),
    responseCookies: createResponseCookieStore(response),
  });

  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(session.accessToken);

  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return redirectWithCookies(loginUrl, response);
  }

  if (isAuthRoute(pathname) && isAuthenticated) {
    return redirectWithCookies(new URL("/dashboard", request.url), response);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
