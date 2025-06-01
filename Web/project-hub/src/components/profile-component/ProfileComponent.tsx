"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
import { profileType } from "@/type/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileComponent = () => {
  const { data } = useGetUserQuery();
  const profileData = data?.data as profileType;

  // console.log("Full profile data:", profileData);
  // console.log("Social links data:", profileData?.socialLinks);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 min-w-[320px]">
          <CardHeader className="flex flex-row gap-4">
            <Avatar className="h-52 w-52 border-2 border-green-500 rounded-lg">
              <AvatarImage
                src={`${profileData?.imageUrl}`}
                alt="Dawit Getachew"
              />
              <AvatarFallback>{profileData?.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <CardTitle className="text-3xl">
                {profileData?.fullName}
              </CardTitle>
              <div className="text-2xs text-gray-500">{profileData?.role}</div>
              <div className="text-xl text-muted-foreground">
                {profileData?.department}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{profileData?.bio}</CardDescription>
          </CardContent>
        </Card>

        {/* Contact & Socials */}
        <div className="flex flex-col gap-6 flex-1 min-w-[320px]">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} />
                  <span>{profileData?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} />
                  <span>{profileData?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} />
                  <span>{profileData?.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {profileData?.socialLinks?.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.platform === "github" && <Github size={16} />}
                    {link.platform === "linkedin" && <Linkedin size={16} />}
                    {link.platform === "twitter" && <Twitter size={16} />}
                    {link.url}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData?.skills?.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileComponent;
