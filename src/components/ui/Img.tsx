import { getImageProps, type ImageLoader } from "next/image";
import type { CSSProperties } from "react";
import { getImage, type ImageData } from "@/lib/images";

type Props = {
  id: string | ImageData;
  sizes: string;
  /** Fill the parent (parent must be positioned). Otherwise uses intrinsic aspect ratio. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
  pictureClassName?: string;
  alt?: string;
  /** Override the stored object-position for this crop. */
  position?: string;
  style?: CSSProperties;
  /** Decorative duplicate (e.g. marquee clones): empty alt + aria-hidden. */
  decorative?: boolean;
};

function loaderFor(img: ImageData, ext: "avif" | "webp"): ImageLoader {
  return ({ width }) => {
    const w = img.widths.find((x) => x >= width) ?? img.widths[img.widths.length - 1];
    return `${img.src}-${w}.${ext}`;
  };
}

/**
 * A pre-optimized photo: AVIF with WebP fallback via <picture>, blur-up placeholder and
 * dominant-colour background so nothing flashes white. Built on next/image's getImageProps.
 */
export function Img({ id, sizes, fill, priority, className, pictureClassName, alt, position, style, decorative }: Props) {
  const img = typeof id === "string" ? getImage(id) : id;
  const common = {
    alt: decorative ? "" : (alt ?? img.alt),
    sizes,
    priority,
    placeholder: "blur" as const,
    blurDataURL: img.blurDataURL,
    ...(fill ? { fill: true as const } : { width: img.width, height: img.height }),
  };
  const {
    props: { srcSet: avifSrcSet },
  } = getImageProps({ ...common, src: `${img.src}.avif`, loader: loaderFor(img, "avif") });
  const { props } = getImageProps({ ...common, src: `${img.src}.webp`, loader: loaderFor(img, "webp") });

  return (
    <picture className={pictureClassName ?? "contents"}>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from props */}
      <img
        {...props}
        aria-hidden={decorative || undefined}
        className={className}
        style={{
          ...props.style,
          backgroundColor: img.dominantColor,
          objectFit: "cover",
          objectPosition: position ?? img.position,
          ...(fill ? {} : { height: "auto" }),
          ...style,
        }}
      />
    </picture>
  );
}
