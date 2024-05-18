export default function NavBar({tabs, activeTab, setActiveTab}){
    return(
        <>
        <div className="flex justify-center space-x-4 bg-[#1f1f1f] text-white py-2">
            {tabs.map((tab)=> (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded flex items0center space-x-2 ${activeTab == tab.id ? 'bg-gray-700':''}`}
                >
                    {tab.icon && (typeof tab.icon === 'string' ? <img src={tab.icon} alt={tab.label} className="h-6 w-6" /> : tab.icon)}
                    <span>{tab.label}</span>
                </button>
        ))}
        </div>
        <style jsx>{`
        .tabs button {
        padding: 10px;
        margin-right: 5px;
        background: lightgray;
        border: none;
        outline: none;
        cursor: pointer;
        }
        .tabs button.active {
        background: darkgray;
        color: white;
        }
    `}</style>
       </>
    );
}