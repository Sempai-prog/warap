import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IdentityFormWrapper, DesignFormWrapper, BusinessFormWrapper } from "@/components/settings/SettingsWrappers";

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl bg-neutral-100 p-1">
          <TabsTrigger value="identity" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Identité</TabsTrigger>
          <TabsTrigger value="design" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Design</TabsTrigger>
          <TabsTrigger value="business" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Identité de la boutique</CardTitle>
              <CardDescription>Modifiez votre nom, bio et images.</CardDescription>
            </CardHeader>
            <CardContent>
              <IdentityFormWrapper />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez vos couleurs et polices.</CardDescription>
            </CardHeader>
            <CardContent>
              <DesignFormWrapper />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Configuration Business</CardTitle>
              <CardDescription>Gérez vos paiements et livraisons.</CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessFormWrapper />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
