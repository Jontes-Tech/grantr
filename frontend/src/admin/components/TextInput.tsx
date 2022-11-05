export const TextInput = (props) => {
    return (
        <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
            {props.name}
            <input
                defaultValue={props.defaultValue}
                ref={props.ref}
                placeholder={props.placeholder}
                type={props.type}
                className='focus:outline-none focus:border-2 focus:border-primary focus:ring-primary bg-neutral-600 text-sm rounded-lg block w-full p-2.5 text-white'
            ></input>
        </div>
    );
};
