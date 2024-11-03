import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar"



const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar>
      <AvatarImage src={user?.imageUrl} />
    </Avatar>
  )
}

export default UserAvatar
