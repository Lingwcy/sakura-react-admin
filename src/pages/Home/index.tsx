import ServerCard from "@/components/server-card";
import test_video_banner from '@assets/banner/test_video_banner.webm'
import test_image_banner from '@assets/banner/banner_img.png'
import BTicon from '@/assets/server-icons/2b2t.png'
import { arclightImage } from "@/types/minecraft-server-images"
import type { MinecraftServerCardBadge } from "@/types/minecraft-server-item-type";
import { ServerGamemodes } from "@/types/minecraft-server-types";
const Home: React.FC = () => {

  const badge1: MinecraftServerCardBadge = {
    isAuthMode: 1,
    isCrossVersion: 1,
    version: "1.12.2",
    gamemodes: ServerGamemodes.NoRule
  }
  const badge2: MinecraftServerCardBadge = {
    gamemodes: ServerGamemodes.Survival,
    isAuthMode: 0,
    isCrossVersion: 0,
    version: "1.21.5",
  }
  return (
    <div className="flex flex-col max:w-2xl h-screen space-y-1.5">
      <ServerCard
        className=""
        serverName="2B2T"
        addressUrl="2b2t.org"
        maxPlayer={420}
        currentPlayer={264}
        bannerUrl={test_video_banner}
        serverIconUrl={BTicon}
        serverBadge={badge1}
        isRuning = {true}
      />
      <ServerCard
        className=""
        serverName="MiaoTown VI"
        addressUrl="mc.miaotown.cc"
        maxPlayer={50}
        currentPlayer={14}
        bannerUrl={test_image_banner}
        serverIconUrl={arclightImage}
        serverBadge={badge2}
      />
    </div>
  )
};

export default Home;