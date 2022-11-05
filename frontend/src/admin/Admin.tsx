import { FC, useRef } from 'react';
import { AdminPostList } from './components/AdminPostList';
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

    const inputStyle =
        'focus:outline-none focus:border-2 focus:border-primary focus:ring-primary bg-neutral-600 text-sm rounded-lg block w-full p-2.5 text-white ';
    const [showSidebar, setShowSidebar] = useState(true);
    const websiteRef = useRef(null);
    const twitterRef = useRef(null);
    const discordRef = useRef(null);
    const telegramRef = useRef(null);
    const whitepaperRef = useRef(null);
    const imageURLRef = useRef(null);
    const minRef = useRef(null);
    const maxRef = useRef(null);
    const currencyRef = useRef(null);

    function submit() {
        console.log({
            tags: selectedTags[0].value,
            website: websiteRef.current.value,
            twitter: twitterRef.current.value,
            discord: discordRef.current.value,
            telegram: telegramRef.current.value,
            whitepaper: whitepaperRef.current.value,
            imageurl: imageURLRef.current.value,
            min: minRef.current.value,
            max: maxRef.current.value,
            currency: currencyRef.current.value,
        });
    }

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
        <div className="text-white">
            <div className="flex justify-between w-full border-b border-neutral-700 h-12 bg-black-80 relative z-50 text-white">
                <div className="flex">
                    <div className="flex gap-2 h-full items-center px-4 border-r border-neutral-700 hover:bg-neutral-800 cursor-pointer">
                        <div>
                            <div className="brightness-150 text-[#FFCC00] bg-clip-text text-transparent font-bold leading-none">
                                Grantr
                            </div>

                            <div className="leading-none text-sm">Admin</div>
                        </div>
                    </div>

                    <div
                        onClick={() => {
                            setShowSidebar(!showSidebar);
                        }}
                        className="block sm:hidden items-center w-fit h-full border-r border-neutral-700 pl-4 pr-4 cursor-pointer hover:bg-neutral-800"
                    >
                        Toggle Sidebar
                    </div>
                </div>
            </div>
            <div className="flex">
                {/* This is going to be the div for everthing except the navbar */}
                {showSidebar && (
                    <aside
                        className="w-72 h-full border-r-2 border-gray-600 sticky top-0 left-0"
                        aria-label="Sidebar"
                    >
                        <div className="py-4 px-3 bg-dark rounded border-white h-screen overflow-y-scroll">
                            <ul className="space-y-2">
                                <p className="bg-primary text-center p-2 border-gray-600 border-4 text-dark">
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
                )}
                <main className="md:m-14">
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
                                <div className="max-w-full">
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
                            <div className="grid md:grid-cols-2 gap-2">
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Website
                                    <input
                                        defaultValue={grant?.website}
                                        ref={websiteRef}
                                        placeholder="https://grantr.app"
                                        className={inputStyle}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Twitter
                                    <input
                                        defaultValue={grant?.twitter || ''}
                                        placeholder="grantrapp"
                                        ref={twitterRef}
                                        className={inputStyle}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Discord
                                    <input
                                        defaultValue={grant?.discord || ''}
                                        placeholder="https://discord.gg/QnRvyGNcYU"
                                        ref={discordRef}
                                        className={inputStyle}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Telegram
                                    <input
                                        defaultValue={grant?.telegram || ''}
                                        placeholder="https://t.me/grantr"
                                        ref={telegramRef}
                                        className={inputStyle}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Whitepaper
                                    <input
                                        defaultValue={grant?.whitepaper || ''}
                                        placeholder="https://grantr.app/whitepaper"
                                        ref={whitepaperRef}
                                        className={inputStyle}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Image URL
                                    <input
                                        defaultValue={grant?.image_url || ''}
                                        placeholder="https://grantr.app/favicon.26c58106.png"
                                        className={inputStyle}
                                        ref={imageURLRef}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Minimum Amount
                                    <input
                                        type="number"
                                        defaultValue={grant?.min_amount || 0}
                                        placeholder="100"
                                        className={inputStyle}
                                        ref={minRef}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Maximum Amount
                                    <input
                                        defaultValue={grant?.max_amount || 0}
                                        type="number"
                                        placeholder="1000"
                                        className={inputStyle}
                                        ref={maxRef}
                                    ></input>
                                </div>
                                <div className="bg-neutral-800 p-2 rounded-lg shadow-lg">
                                    Currency
                                    <input
                                        defaultValue={grant?.currency || ''}
                                        placeholder=""
                                        className={inputStyle}
                                        ref={currencyRef}
                                    ></input>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h2 className="text-xl pb-2">Description</h2>
                                <textarea
                                    className="
                                  form-control
                                  block
                                  w-full
                                  px-3
                                  py-1.5
                                  text-base
                                  font-normal
                                  text-white
                                  bg-neutral-700 bg-clip-padding
                                  border border-solid border-gray-500
                                  rounded
                                  transition
                                  ease-in-out
                                  m-0
                                  focus:outline-none focus:border-primary
                                "
                                    rows={3}
                                ></textarea>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={submit}
                                    className="bg-primary text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6"
                                >
                                    Save
                                </button>
                                <p className='text-xs text-neutral-500'><span className='text-neutral-400 text-bold uppercase'>Protip!</span> Make sure you are certain about the content you submit. There is no undo.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
