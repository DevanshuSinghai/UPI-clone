
export function Button({label, onPress}){
    return <button onClick={onPress} type="button" className="mt-4 text-white bg-gray-800 hover:bg-gray-900 0 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full">{label}</button>
}