import { IImageProps, Image } from 'native-base'

type ImageAdsProps = IImageProps & {
  size: number
}

export function ImageAds({ size, ...rest }: ImageAdsProps) {
  return (
    // eslint-disable-next-line
    <Image
      w={size}
      h={size}
      rounded="xl"
      {...rest}
    />
  )
}
