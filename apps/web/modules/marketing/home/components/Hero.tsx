import { ChangeMakersLabel } from "@shared/components/ChangeMakersLabel";
import { TotalActionsCard } from "@shared/components/TotalActionsCard";
import Village from "@shared/components/Village";

export async function Hero() {
  return (
    <nav className="to-primary/5 from-transparent pb-20">
      <div className="container text-center">
        <div className="flex justify-center gap-2 align-middle">
          <ChangeMakersLabel />
          <TotalActionsCard />
        </div>

        <div className="mt-12 text-left">
          <h1 className="m-0 text-3xl font-black italic opacity-50 lg:text-7xl">
            IT TAKES A VILLAGE
          </h1>
        </div>
        <Village />
        <div className="mt-12">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/album/3Vh61hiy1BMzAAGaxpBNzM?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            title="Spotify Album Embed"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>

        <div className="mt-16 px-8 text-center">
          {/* <h5 className="text-foreground/50 text-xs font-semibold uppercase tracking-wider">
            Built & shipped with these awesome tools
          </h5> */}
          {/* Tools Logos */}
          <div className="text-primary/50 mt-4 flex flex-col-reverse items-center justify-center gap-4 md:flex-row md:gap-8">
            {/* Logos can stay unchanged */}
          </div>
        </div>
      </div>
    </nav>
  );
}
