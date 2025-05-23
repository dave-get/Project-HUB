"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileImageUpload } from "@/components/settings/ProfileImageUpload"
import { PersonalInfoForm } from "@/components/settings/PersonalInfoForm"
import { ProfessionalInfoForm } from "@/components/settings/ProfessionalInfoForm"
import { SocialLinksForm } from "@/components/settings/SocialLinksForm"
import { SkillsForm } from "@/components/settings/SkillsForm"
import { PasswordForm } from "@/components/settings/PasswordForm"
import { User, Briefcase, Link2, Code, Lock } from "lucide-react"
import { Suspense } from "react"

function TabIcon({ icon: Icon, ...props }: { icon: any }) {
  return <Icon className="h-4 w-4" {...props} />
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Profile Image */}
        <div className="w-full lg:w-80">
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <ProfileImageUpload />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Settings Tabs */}
        <div className="flex-1">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <TabIcon icon={User} />
                <span className="hidden sm:inline">Personal Info</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <TabIcon icon={Briefcase} />
                <span className="hidden sm:inline">Professional</span>
                <span className="sm:hidden">Work</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <TabIcon icon={Link2} />
                <span className="hidden sm:inline">Social</span>
                <span className="sm:hidden">Links</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <TabIcon icon={Code} />
                <span className="hidden sm:inline">Skills</span>
                <span className="sm:hidden">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <TabIcon icon={Lock} />
                <span className="hidden sm:inline">Security</span>
                <span className="sm:hidden">Pass</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading...</div>}>
                    <PersonalInfoForm />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Update your professional details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ProfessionalInfoForm />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Manage your social media profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading...</div>}>
                    <SocialLinksForm />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Manage your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading...</div>}>
                    <SkillsForm />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading...</div>}>
                    <PasswordForm />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 