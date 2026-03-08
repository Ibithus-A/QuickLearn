import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const hasAuthCallbackParams =
    nextUrl.searchParams.has("code") ||
    nextUrl.searchParams.has("token_hash") ||
    nextUrl.searchParams.has("type") ||
    nextUrl.hash.includes("access_token") ||
    nextUrl.hash.includes("refresh_token");

  // Do not touch one-time auth callback URLs here.
  // Let the client-side password pages consume these tokens directly.
  if (hasAuthCallbackParams) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const { url, key } = getSupabaseEnv();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
