"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Award,
  Briefcase,
  Calendar,
} from "lucide-react";
import { useGetUserQuery } from "@/features/profileApi/profileApi";
import { profileType } from "@/type/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ProfileComponent = () => {
  const { data } = useGetUserQuery();
  const profileData = data?.data as profileType;

  // console.log("Full profile data:", profileData);
  // console.log("Social links data:", profileData?.socialLinks);

  return (
    <div className="min-h-screen bg-gradient-to-br via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 rounded-3xl opacity-10 blur-3xl" />
          <div className="relative backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <Avatar className="h-56 w-56 border-4 border-white shadow-2xl transition-all duration-500 hover:scale-105 relative">
                  <AvatarImage
                    src={`${profileData?.imageUrl}`}
                    alt={profileData?.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-5xl text-white">
                    {profileData?.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-5xl font-bold bg-clip-text mb-4">
                  {profileData?.fullName}
                </h1>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-600 font-medium mb-4">
                  {profileData?.role}
                </div>
                <p className="text-2xl text-gray-600 mb-6">
                  {profileData?.department}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span>5+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>10+ Projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Available for Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="border rounded-t-lg">
                <CardTitle className="text-2xl font-bold">
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-lg leading-relaxed">
                  {profileData?.bio}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Skills Section */}
            {profileData?.role === "student" && (
              <Card className="backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="border rounded-t-lg">
                  <CardTitle className="text-2xl font-bold">
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-3">
                    {profileData?.skills?.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:from-blue-200 hover:to-purple-200 transition-all duration-300 cursor-default transform hover:scale-105"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <Card className="backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="border rounded-t-lg">
                <CardTitle className="text-2xl font-bold">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 group">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                      <Phone size={20} className="text-blue-600" />
                    </div>
                    <span className="text-base">{profileData?.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 group">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                    <span className="text-base">{profileData?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 group">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <span className="text-base">{profileData?.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Profiles Card */}
            <Card className="backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="border rounded-t-lg">
                <CardTitle className="text-2xl font-bold">
                  Social Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {profileData?.socialLinks?.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                        {link.platform === "github" && (
                          <Github size={20} className="text-blue-600" />
                        )}
                        {link.platform === "linkedin" && (
                          <Linkedin size={20} className="text-blue-600" />
                        )}
                        {link.platform === "twitter" && (
                          <Twitter size={20} className="text-blue-600" />
                        )}
                      </div>
                      <span className="text-base group-hover:underline">
                        {link.url}
                      </span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
