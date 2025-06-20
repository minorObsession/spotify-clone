import { ReactNode, useState } from "react";
import { IoMdPlay } from "react-icons/io";

interface GenericCardProps {
  imageUrl: string;
  name: string;
  isPodcast?: boolean;
  footer?: ReactNode;
  onPlayClick?: () => void;
  onClick?: () => void;
}

function GenericCard({
  imageUrl,
  name,
  footer,
  onPlayClick,
  onClick,
  isPodcast,
}: GenericCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <article
      className="search-view-card relative"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={onClick}
    >
      <img
        className={`h-40 w-40 rounded-xl ${
          isCardHovered ? "brightness-75" : ""
        } transition-all duration-100`}
        src={imageUrl}
        alt={name}
      />
      <div className="flex flex-col items-start gap-1">
        <h4 className="line-clamp-2 hover:underline">{name}</h4>

        {!isPodcast && (
          <IoMdPlay
            className={`green-play-pause-button absolute top-3/7 right-1/8 z-10 cursor-pointer brightness-100 transition-all duration-200 ease-out ${
              isCardHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            size={48}
            onClick={onPlayClick}
          />
        )}

        {/* // ! CARD FOOTER */}
        {footer}
      </div>
    </article>
  );
}

export default GenericCard;
