export default function AvatarUser({ user }: any) {
    console.log(user)
    return (
        <div className="flex items-center gap-2">

            <div>
                <img src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} className="w-12 h-12 rounded-full" />
            </div>
            <p className="font-semibold">{user?.user_metadata?.full_name}</p>
        </div>
    )
}