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
import TextInput from './components/TextInput';
import { Profile } from '../components/Profile';

export const Admin: FC<{ isNew?: boolean }> = ({ isNew = false }) => {
    const [showSidebar, setShowSidebar] = useState(true);

    // TODO: Somehow make this more readable and less bloated
    const websiteRef = useRef(null);
    const twitterRef = useRef(null);
    const discordRef = useRef(null);
    const telegramRef = useRef(null);
    const whitepaperRef = useRef(null);
    const imageURLRef = useRef(null);
    const minRef = useRef(null);
    const maxRef = useRef(null);
    const currencyRef = useRef(null);
    const titleRef = useRef(null);

    const submit = () => {
        console.log({
            tags: selectedTags[0].value || '',
            website: websiteRef?.current.value || '',
            twitter: twitterRef?.current.value || '',
            discord: discordRef?.current.value || '',
            telegram: telegramRef?.current.value || '',
            whitepaper: whitepaperRef?.current.value || '',
            imageurl: imageURLRef?.current.value || '',
            min: minRef?.current.value || '',
            max: maxRef?.current.value || '',
            currency: currencyRef?.current.value || '',
            title: titleRef?.current.value || '',
        });
    };

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
            if (id === undefined) return;
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

    const [tagOptions, setTagOptions] = useState<{}[]>();
    const [selectedTags, setSelectedTags] = useState<{}>();

    useMemo(() => {
        setTagOptions(parseSelect(tags ?? {}));
        setSelectedTags(
            (grant?.tags as string)
                .split(',')
                .map((t) => tagOptions.find((o: { value: string; }) => o.value === t))
                .filter((t) => t)
        );
    }, [grant, tags]);

    const handleResize = () => {
        if (window.innerWidth < 640) {
            setShowSidebar(false)
        } else {
            setShowSidebar(true);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize)
    }, [])
    return (
        <div className="text-white">
            {(showSidebar && window.innerWidth < 640) && (<div className='fixed h-full w-full l-0 t-0 opacity-90 backdrop-blur-3xl z-[90]'>Hello, Jonte World</div>)}
            <div className="bg-dark sticky top-0 left-0 z-[100] flex justify-between w-full border-b border-neutral-700 h-10 bg-black-80 text-white">
                <div className="flex">
                    <div className="flex gap-2 h-full items-center bg-dark px-4 border-r border-neutral-700 hover:bg-neutral-800 cursor-pointer">
                        <div>
                            <div className="text-[#FFCC00] text-transparent font-bold leading-none">
                                Grantr
                            </div>

                            <div className="leading-none text-sm">Admin</div>
                        </div>
                    </div>
                    <Profile></Profile>
                    <div
                        onClick={() => {
                            setShowSidebar(!showSidebar);
                        }}
                        className="flex gap-2 h-full items-center px-4 border-r border-neutral-700 hover:bg-neutral-800 cursor-pointer"
                    >
                        Toggle Sidebar
                    </div>
                </div>
            </div>
            <div className="flex">
                {showSidebar && (
                    <aside
                        className="w-72 h-full border-r-2 border-gray-600 z-[100] top-10 left-0 fixed sm:top-0 sm:sticky"
                        aria-label="Sidebar"
                    >
                        <div className="py-4 px-3 bg-dark rounded border-white h-screen overflow-y-scroll">
                            <ul className="space-y-2">
                                <p className="bg-primary bg text-center p-2 border-gray-600 border-4 text-dark">
                                    Grants
                                </p>
                                <Link
                                    to="/admin/new"
                                    className="w-full justify-left flex justify-start p-2 bg-neutral-800 shadow-lg rounded-lg"
                                >
                                    <div className="align-middle">
                                        <p className="text-white text-lg">
                                            + Create New!
                                        </p>
                                    </div>
                                </Link>
                                <AdminPostList/>
                            </ul>
                        </div>
                    </aside>
                )}
                <main className="md:m-14 flex-1">
                    <>
                        {!id && !isNew && (
                            <div>
                                <h1 className="text-4xl text-white">
                                    Welcome to the Admin Interface!
                                </h1>
                                <p className="text-2xl text-gray-400">
                                    Select one of grants on the left hand side
                                    of the screen to edit one.
                                </p>
                            </div>
                        )}
                        {(id || isNew) && (
                            <div className="p-2 text-white">
                                <div className="flex place-items-center">
                                    <img
                                        className="aspect-square h-16 rounded-full border-2 border-gray-400"
                                        src={grant?.image_url || notfoundimage}
                                    />
                                    <h1
                                        className="p-4 max-w-48 text-3xl inline-block text-white"
                                        ref={titleRef}
                                    >
                                        {grant?.name || 'Enter a Grant Name'}
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
                                    <TextInput
                                        name="Website"
                                        defaultValue={
                                            isNew ? '' : grant?.website
                                        }
                                        ref={websiteRef}
                                        placeholder="https://grantr.app"
                                        type="text"
                                    />
                                    <TextInput
                                        name="Twitter"
                                        defaultValue={
                                            isNew ? '' : grant?.twitter
                                        }
                                        ref={twitterRef}
                                        placeholder="grantrapp"
                                        type="text"
                                    />
                                    <TextInput
                                        name="Discord"
                                        defaultValue={
                                            isNew ? '' : grant?.discord
                                        }
                                        ref={discordRef}
                                        placeholder="https://discord.gg/QnRvyGNcYU"
                                        type="text"
                                    />
                                    <TextInput
                                        name="Telegram"
                                        defaultValue={
                                            isNew ? '' : grant?.telegram
                                        }
                                        ref={telegramRef}
                                        placeholder="https://t.me/grantr"
                                        type="text"
                                    />
                                    <TextInput
                                        name="Whitepaper"
                                        defaultValue={
                                            isNew ? '' : grant?.whitepaper
                                        }
                                        ref={whitepaperRef}
                                        placeholder="https://grantr.app/whitepaper"
                                        type="text"
                                    />
                                    <TextInput
                                        name="Image URL"
                                        defaultValue={
                                            isNew ? '' : grant?.image_url
                                        }
                                        ref={imageURLRef}
                                        placeholder="https://grantr.app/favicon.26c58106.png"
                                        type="text"
                                    />
                                    <TextInput
                                        name="Minimum Amount"
                                        defaultValue={
                                            isNew ? '' : grant?.min_amount
                                        }
                                        ref={minRef}
                                        placeholder="0"
                                        type="number"
                                    />
                                    <TextInput
                                        name="Maximum Amount"
                                        defaultValue={
                                            isNew ? '' : grant?.max_amount
                                        }
                                        ref={maxRef}
                                        placeholder="1000"
                                        type="number"
                                    />
                                    <TextInput
                                        name="Currency"
                                        defaultValue={
                                            isNew ? '' : grant?.currency
                                        }
                                        ref={currencyRef}
                                        placeholder=""
                                        type="text"
                                    />
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-xl pb-2">
                                        Description
                                    </h2>
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
                                        defaultValue={
                                            isNew ? '' : grant?.description
                                        }
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
                                    <p className="text-xs text-neutral-500">
                                        <span className="text-neutral-400 text-bold uppercase">
                                            Protip!
                                        </span>{' '}
                                        Make sure you are certain about the
                                        content you submit. There is no undo
                                        (you'll have to roll back a backup).
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                </main>
            </div>
        </div>
    );
};
