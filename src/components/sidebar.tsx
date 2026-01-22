import vinylLogo from "../assets/vinyl.jpg"
import DatabaseIcon from "./icons/database"
import CompassIcon from "./icons/compass"
import BookmarkIcon from "./icons/bookmark"

const iconsSize = 28

const listItems = [
    {
        icon: <DatabaseIcon size={iconsSize} color="var(--text-disabled-color)" />,
        text: "collection"
    },
    {
        icon: <CompassIcon size={iconsSize} color="var(--text-disabled-color)" />,
        text: "discovery"
    },
    {
        icon: <BookmarkIcon size={iconsSize} color="var(--text-disabled-color)" />,
        text: "WishList"
    }
]

export default function Sidebar() {
    return (
        <div className="flex flex-col h-screen max-w-[200px] lg:max-w-[400px] w-full pl-10 pt-6 border-r border-[var(--border-color)]">
            <div className="flex items-center py-4">
                <img src={vinylLogo} alt="vinyl-vault-logo" className="w-12 h-12" />
                <h1 className="ml-2 text-2xl font-bold italic">vinyl vault</h1>
            </div>
            <div className="flex-1 flex items-start">

                <ul>
                    {listItems.map((item, index) => (
                        <li key={index} className="flex items-center my-4 hover:bg-[var(--card-bg-color)] hover:text-[var(--text-title-color)]">
                            {item.icon}
                            <span className="ml-4">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="">
                <h1>Footer</h1>
            </div>
        </div>
    )
}
