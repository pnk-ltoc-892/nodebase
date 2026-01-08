import AppHeader from "@/components/AppHeader"


const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
    <AppHeader />
    <main className="flex-1">{children}</main>
    </>
  )
}

export default layout