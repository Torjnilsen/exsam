import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "./button";


  
  const ProfileButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profilepage"><DropdownMenuItem className="cursor-pointer">Profile Page</DropdownMenuItem> </Link>
        <Link href="/newistings"><DropdownMenuItem className="cursor-pointer">New Listing</DropdownMenuItem> </Link>
          <DropdownMenuSeparator />
         <Button variant="ghost"><Link href="logout"><DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem></Link> </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default ProfileButton;