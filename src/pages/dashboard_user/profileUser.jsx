import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { getUserData } from "@/utils/auth";

export function ProfileUser() {
  const user = getUserData();
  return (
    <>
      <Card className="mx-3 mb-6 mt-5 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={user?.image ? `http://localhost:3000/uploads/${user.image}` : "/img/placeholder.png"}
                alt={user?.fullname || "User"}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {user?.fullname || "-"}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {user?.role === "admin" ? "Admin" : "Customer"}
                </Typography>
              </div>
            </div>
          </div>
          <div className="w-full">
            <ProfileInfoCard
              title="Profile Information"
              description={user?.bio || "-"}
              details={{
                "Full Name": user?.fullname || "-",
                Email: user?.email || "-",
                Phone: user?.phone || "-",
                Address: user?.address || "-",
                Status: user?.status || "-",
                "Created At": user?.created_at ? new Date(user.created_at).toLocaleString("id-ID") : "-",
                "Updated At": user?.updated_at ? new Date(user.updated_at).toLocaleString("id-ID") : "-",
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default ProfileUser;
