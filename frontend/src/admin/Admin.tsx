import { FC } from 'react';
import { AdminPostList } from './AdminPostList';
import { Link, useParams } from 'react-router-dom';
import { GLOBALS } from '..';
import { GrantProgram } from '../../../backend/src/grant.type';
import useSWR from 'swr';
import notfoundimage from '../images/notfoundimage.webp';
import plusimage from '../images/plusimage.webp';
import Select, { StylesConfig } from 'react-select';
import { useState, useEffect, useMemo } from 'react';
import { theme } from '../styles/selectStyle';

export const Admin: FC = () => {
    const { id } = useParams();
    const { data: tags } = useSWR(
        `/tags/list`,
        async () => {
            const request = await fetch(GLOBALS.API_URL + `/tags/list`);

            return await request.json();
        },
        { revalidateOnFocus: true }
    );
    const { data: grant } = useSWR(
        `/api/get/${id}`,
        async () => {
            const request = await fetch(GLOBALS.API_URL + `/get?query=${id}`);

            return (await request.json()) as GrantProgram;
        },
        { revalidateOnFocus: true }
    );

    const parseSelect = (data: { [key: string]: { name: string } }) => {
        return Object.entries(data).map(([name, { name: label }]) => ({
            label,
            value: name,
        }));
    };

    const [tagOptions, setTagOptions] = useState<any>();
    const [selectedTags, setSelectedTags] = useState<any>();

    useMemo(() => {
        setTagOptions(parseSelect(tags ?? {}));
        setSelectedTags(
            (grant?.tags as string)
                .split(',')
                .map((t) => tagOptions.find((o) => o.value === t))
                .filter((t) => t)
        );
    }, [grant, tags]);

    return (
        <div>
            {/* React requires me to make this div here :jonteshrug: */}
            <div className="flex">
                {/* This is the div for everthing except the navbar */}
                <aside
                    className="w-72 h-full border-r-2 border-gray-600"
                    aria-label="Sidebar"
                >
                    <div className="py-4 px-3 bg-dark rounded border-white h-screen overflow-y-scroll">
                        <ul className="space-y-2">
                            <p className="bg-primary text-center p-2 border-gray-600 border-4">
                                Grants
                            </p>
                            <Link
                                to="/admin/new"
                                className="w-full justify-left flex justify-start p-2 bg-neutral-800 shadow-lg rounded-lg"
                            >
                                <img
                                    className="h-8 mr-2 aspect-square rounded-full"
                                    src={plusimage}
                                />
                                <div className="align-middle">
                                    <p className="text-white text-lg">
                                        Create New!
                                    </p>
                                </div>
                            </Link>
                            <AdminPostList />
                        </ul>
                    </div>
                </aside>
                <main className="m-14">
                    {!id && (
                        <div>
                            <h1 className="text-4xl text-white">
                                Welcome to the Admin Interface!
                            </h1>
                            <p className="text-2xl text-gray-400">
                                Select one of grants on the left hand side of
                                the screen to edit one.
                            </p>
                        </div>
                    )}
                    {id && (
                        <div className="p-2 text-white">
                            <div className="flex place-items-center">
                                <img
                                    className="aspect-square h-16 rounded-full border-2 border-gray-400"
                                    src={grant?.image_url || notfoundimage}
                                />
                                <h1 className="p-4 text-3xl inline-block text-white">
                                    {grant?.name}
                                </h1>
                            </div>
                            <div className="py-8">
                                <h2 className="text-xl pb-2">
                                    Tags and Labels
                                </h2>
                                <div className="min-w-60 w-96">
                                    <Select
                                        name="colors"
                                        options={tagOptions}
                                        value={selectedTags}
                                        onChange={(e) => setSelectedTags(e)}
                                        isMulti
                                        theme={theme}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Website
                                    <input
                                        value={grant?.website}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Twitter
                                    <input
                                        value={grant?.twitter || ''}
                                        placeholder="grantrapp"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Discord
                                    <input
                                        value={grant?.discord || ''}
                                        placeholder="https://discord.gg/QnRvyGNcYU 
                                        "
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Telegram
                                    <input
                                        value={grant?.telegram || ''}
                                        placeholder="https://t.me/grantr"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Whitepaper
                                    <input
                                        value={grant?.whitepaper || ''}
                                        placeholder="https://grantr.app/whitepaper"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Image URL
                                    <input
                                        value={grant?.image_url || ''}
                                        placeholder="https://grantr.app/favicon.26c58106.png"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    ></input>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="bg-primary text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
