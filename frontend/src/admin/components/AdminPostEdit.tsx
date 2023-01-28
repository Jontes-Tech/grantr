import { FC } from 'react';
import { useParams } from 'react-router';
import { InputActionMeta } from 'react-select';
import Select, { MultiValue, StylesConfig } from 'react-select';
import useSWR from 'swr';
import { GLOBALS } from '../..';
import { GrantProgram } from '../../../../backend/src/grant.type';
import notfoundimage from '../images/notfoundimage.webp';
import TextInput from './TextInput';
import { generateSunflake } from 'sunflake';
import { SaveButton } from '../../components/SaveButton';
import { useForm } from 'react-hook-form';
const { id } = useParams();

export const AdminPostList: FC = (isNew: boolean, isTag: boolean) => {
    const { data: grant } = useSWR(
        `/api/get/${id}`,
        async () => {
            if (id === undefined) return;
            const request = await fetch(GLOBALS.API_URL + `/get?query=${id}`);

            return (await request.json()) as GrantProgram;
        },
        { revalidateOnFocus: true }
    );
    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            id: grant?.id || generateSunflake(),
            name: grant?.name,
            organization_id: 1,
            description: grant?.description,
            tags: grant?.tags || '',
            min_amount: grant?.min_amount || '',
            max_amount: grant?.max_amount || '',
            currency: grant?.currency || '',
            apply_url: grant?.apply_url || '',
            image_url: grant?.image_url || '',
            website: grant?.website || '',
        },
    });
    return (
        <>
            <div className="p-2 text-white">
                <div className="flex place-items-center">
                    <img
                        className="aspect-square h-16 rounded-full border-2 border-gray-400"
                        src={grant?.image_url || notfoundimage}
                    />
                    <h1 className="p-4 max-w-48 text-3xl inline-block text-white">
                        <input
                            className="bg-neutral-800 p-4 rounded shadow-lg min-w-48"
                            type="text"
                            defaultValue={grant?.name || 'Enter a Grant Name'}
                        ></input>
                    </h1>
                </div>
                <div className="py-8">
                    <h2 className="text-xl pb-2">Tags and Labels</h2>
                    <div className="max-w-full"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                    // Replace this
                    <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                        Website
                        <input
                            placeholder="https://grantr.app"
                            type="text"
                            {...(register('website'), { required: true })}
                            className="focus:outline-none focus:outline-primary bg-neutral-600 text-sm rounded-lg block w-full p-2.5 text-white"
                        ></input>
                    </div>
                </div>
                <div>
                    {/* <span onClick={async () => await uploadData()}>
                        <SaveButton isAdmin={isAdmin} loading={false} />
                    </span> */}
                    {/* IMPLEMENT POPUP WITH GRANT VIEW :) */}
                    {/* <button
                                    type="button"
                                    onClick={() => alert("Feature not implemented :jonteshrug:")}
                                    className="bg-neutral-500 text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6"
                                >
                                    Preview
                                </button> */}
                    {/* {!isNew && (
                                    <button
                                        type="button"
                                        onClick={() => deleteData()}
                                        className="bg-red-600 text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6"
                                    >
                                        Delete
                                    </button>
                                )} */}
                    <p className="text-xs text-neutral-500">
                        <span className="text-neutral-400 text-bold uppercase">
                            Protip!
                        </span>{' '}
                        Make sure you are certain about the content you submit.
                        There is no undo (you'll have to roll back a backup).
                    </p>
                </div>
            </div>
        </>
    );
};
