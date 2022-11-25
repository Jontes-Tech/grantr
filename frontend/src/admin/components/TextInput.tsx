import {
    forwardRef,
    LegacyRef,
} from 'react';
const TextInput = (
    props: {
        name: string;
        defaultValue: string;
        placeholder: string;
        type: string;
    },
    ref: LegacyRef<HTMLInputElement>
) => {
    return (
        <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
            {props.name}
            <input
                defaultValue={props.defaultValue}
                ref={ref}
                placeholder={props.placeholder}
                type={props.type}
                className="focus:outline-none focus:outline-primary bg-neutral-600 text-sm rounded-lg block w-full p-2.5 text-white"
            ></input>
        </div>
    );
};
export default forwardRef(TextInput);
