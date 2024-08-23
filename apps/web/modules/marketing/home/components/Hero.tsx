import { Link } from "@i18n";
import { Button } from "@ui/components/button";
import { createApiCaller } from "api/trpc/caller";
import { ArrowRightIcon } from "lucide-react";

export async function Hero() {
  const apiCaller = await createApiCaller();
  const user = await apiCaller.auth.user();
  const activeCTAs = await apiCaller.cta.getActiveCTAs();
  const cta = activeCTAs[0];

  const completedCTAs = []
  // const completedCTAs = user.completedCTAs

  return (
    <nav className="to-primary/5 from-transparent pb-20 pt-8">
      <div className="container text-center">
        <h1 className="mx-auto max-w-3xl text-5xl font-bold lg:text-7xl mt-4">
          Action <span className="text-primary">Pal</span>
        </h1>

        <p className="mt-4 text-lg opacity-75">
          Collective action meets momentum.
        </p>
        <p className="mt-4 text-lg opacity-75">
          74 Actions were taken through our app ❤️
        </p>

        {/* Logic for unauthenticated users */}
        {!user ? (
          <>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 md:flex-row">
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">
                  Get Notified
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
            {!cta ? (
              <div className="mt-10">
                <p className="text-lg">Ways to help coming soon. Sign up to be notified.</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-900 border border-gray-700 rounded-md mt-10">
                <div>
                  <div className="text-gray-400 text-sm">
                    <span className="font-bold text-white">18</span> / 52<span className="font-semibold text-white"> People</span> on our app
                  </div>
                  <div className="text-gray-400 text-sm">
                    took <span className="font-semibold text-white">action</span> this week
                  </div>
                </div>
                <div className="my-4 text-base font-semibold">
                  🚨 NEW WAY TO HELP UNLOCKED.
                </div>
                <Button size="lg" asChild>
                  <Link href="/auth/login">
                    TAP TO ACT
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          // Logic for authenticated users
          <div className="mt-10">
            {!cta ? (
              <p className="text-lg">Ways to help coming soon.</p>
            ) : (
              <>
                {completedCTAs.includes(cta) ? (
                  <div className="p-4 bg-green-900 border border-green-700 rounded-md">
                    <p className="text-lg font-semibold">Thanks for completing!</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded-md">
                    <div>
                      <div className="text-gray-400 text-sm">
                        <span className="font-bold text-white">18</span> / 52<span className="font-semibold text-white"> People</span> on our app
                      </div>
                      <div className="text-gray-400 text-sm">
                        took <span className="font-semibold text-white">action</span> this week
                      </div>
                    </div>
                    <div className="my-4 text-base font-semibold">
                      🚨 NEW WAY TO HELP UNLOCKED.
                    </div>
                    <Button size="lg" asChild>
                      <Link href={`/cta/${cta.id}`}>
                        TAP TO ACT
                        <ArrowRightIcon className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-16 px-8 text-center">
          <h5 className="text-foreground/50 text-xs font-semibold uppercase tracking-wider">
            Built & shipped with these awesome tools
          </h5>
          {/* Tools Logos */}
          <div className="text-primary/50 mt-4 flex flex-col-reverse items-center justify-center gap-4 md:flex-row md:gap-8">
            {/* Logos can stay unchanged */}
          </div>
        </div>
      </div>
    </nav>
  );
}
