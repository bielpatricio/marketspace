import { IImageProps, Image } from 'native-base'

type AvatarProps = IImageProps & {
  size: number
}

export function Avatar({ size, ...rest }: AvatarProps) {
  return (
    // eslint-disable-next-line
    <Image
      w={size}
      h={size}
      rounded="full"
      borderWidth={2}
      borderColor="purple.300"
      {...rest}
    />
  )
}
