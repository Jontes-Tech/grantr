import { FC, useCallback, useRef } from 'react';
import { AdminPostList } from './components/AdminPostList';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GLOBALS } from '..';
import { GrantProgram } from '../../../backend/src/grant.type';
import useSWR from 'swr';
import notfoundimage from '../images/notfoundimage.webp';
import plusimage from '../images/plusimage.webp';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { useState, useEffect, useMemo } from 'react';
import { theme } from '../styles/selectStyle';
import TextInput from './components/TextInput';
import { Profile } from '../components/Profile';
import { SaveButton } from '../components/SaveButton';
import { useAccount, useNetwork, useSignTypedData } from 'wagmi';

import { generateSunflake } from 'sunflake';
import { AdminTagList } from './tags/AdminTagList';

const sunflake = generateSunflake();

export const Admin: FC<{ isNew?: boolean, isTag?: boolean }> = ({ isNew = false, isTag = false }) => {
    const accountData = useAccount();
    const isAdmin = useMemo(
        () =>
            accountData &&
            accountData.address &&
            GLOBALS.ADMINS.includes(accountData.address.toLowerCase())
                ? true
                : false,
        [accountData]
    );
    const [showSidebar, setShowSidebar] = useState(true);

    // TODO: Somehow make this more readable and less bloated
    const websiteRef = useRef(null);
    const twitterRef = useRef(null);
    const discordRef = useRef(null);
    const telegramRef = useRef(null);
    const whitepaperRef = useRef(null);
    const minRef = useRef(null);
    const maxRef = useRef(null);
    const currencyRef = useRef(null);
    const idRef = useRef(null);
    const titleRef = useRef(null);

    const { chain: activeChain } = useNetwork();
    const {
        data: _,
        signTypedDataAsync,
        isLoading: isSigning,
    } = useSignTypedData();
    const nav = useNavigate();
    const deleteData = useCallback(async () => {
        console.log('onSign', grant?.id);
        const dataValue = {
            grant_id,
            action: 'delete',
        };

        const signature = await signTypedDataAsync({
            value: dataValue,
            domain: {
                chainId: activeChain?.id,
                name: 'grantr.app',
                version: '1.0',
            },
            types: {
                GrantUpdateRequest: [
                    { name: 'grant_id', type: 'string' },
                    { name: 'action', type: 'string' },
                ],
            },
        });

        const message_data = {
            signature,
            data: dataValue,
        };

        // Inser fetch here
        const request = await fetch(GLOBALS.API_URL + '/delete', {
            method: 'POST',
            body: JSON.stringify(message_data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!request.ok) {
            alert('Oh no, Error');
        } else {
            nav(-1);
        }
    }, []);

    const uploadData = async () => {
        const taglist = selectedTags
            ? selectedTags
                  .map((tag) => tag.value)
                  .sort()
                  .join(',')
            : '';
        console.log('Hi' + taglist);
        const data = {
            tags: taglist,
            website: websiteRef?.current.value || grant?.website || '',
            twitter: twitterRef?.current.value || grant?.twitter || '',
            discord: discordRef?.current.value || grant?.discord || '',
            telegram: telegramRef?.current.value || grant?.telegram || '',
            whitepaper: whitepaperRef?.current.value || grant?.whitepaper || '',
            image_url: imageURLRef?.current.value || grant?.image_url || '',
            min_amount: minRef?.current.value || grant?.min_amount || '',
            max_amount: maxRef?.current.value || grant?.max_amount || '',
            currency: currencyRef?.current.value || grant?.currency || '',
            name: titleRef?.current?.value || grant?.name || '',
            id: idRef?.current.value || grant?.id || '',
        };
        console.log('onSign', data);
        const dataValue = {
            grant_id: data.id,
            grant_data: JSON.stringify(data),
        };

        const signature = await signTypedDataAsync({
            value: dataValue,
            domain: {
                chainId: activeChain?.id,
                name: 'grantr.app',
                version: '1.0',
            },
            types: {
                GrantUpdateRequest: [
                    { name: 'grant_id', type: 'string' },
                    { name: 'grant_data', type: 'string' },
                ],
            },
        });

        const message_data = {
            signature,
            data: dataValue,
        };

        // Inser fetch here
        const request = await fetch(GLOBALS.API_URL + '/update', {
            method: 'POST',
            body: JSON.stringify(message_data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(request);

        if (!request.ok) {
            alert('Error');
        } else {
            nav(-1);
        }
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
    const grant_id = useMemo(
        () => (grant && grant?.id ? grant.id : sunflake()),
        [grant?.id]
    );
    const parseSelect = (data: { [key: string]: { name: string } }) => {
        return Object.entries(data).map(([name, { name: label }]) => ({
            label,
            value: name,
        }));
    };

    const [tagOptions, setTagOptions] =
        useState<MultiValue<{ value: string; label: string }>>();
    const [selectedTags, setSelectedTags] =
        useState<MultiValue<{ value: string; label: string }>>();

    useEffect(() => {
        setTagOptions(parseSelect(tags ?? {}));
        if (grant?.tags !== undefined) {
            setSelectedTags(
                (grant?.tags as string)
                    .split(',')
                    .map((t) =>
                        tagOptions.find((o: { value: string }) => o.value === t)
                    )
                    .filter((t) => t)
            );
        }
    }, [grant, tags]);

    const handleResize = () => {
        if (window.innerWidth < 640) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);
    if (!sessionStorage.getItem('mode')) {
        sessionStorage.setItem('mode', 'grant');
    }
    let [mode, setMode] = useState(sessionStorage.getItem('mode'));
    const imageURLRef = useRef(grant?.image_url || notfoundimage);
    return (
        <div className="text-white">
            {showSidebar && window.innerWidth < 640 && (
                <div className="fixed h-full w-full l-0 t-0 opacity-90 backdrop-blur-3xl z-[90]"></div>
            )}
            <div className="bg-dark sticky top-0 left-0 z-[110] flex justify-between w-full border-b border-neutral-700 h-10 bg-black-80 text-white">
                <div className="flex">
                    <div className="flex gap-2 h-full items-center bg-dark px-4 border-r border-neutral-700 hover:bg-neutral-800 cursor-pointer">
                        <div>
                            <div className="text-[#FFCC00] z-[115] font-bold leading-none">
                                Grantr
                            </div>

                            <div className="leading-none text-sm">Admin</div>
                        </div>
                    </div>
                    <Profile></Profile>
                    <button
                        onClick={() => {
                            setShowSidebar(!showSidebar);
                        }}
                        className="flex gap-2 h-full items-center px-4 border-r border-neutral-700 hover:bg-neutral-800 cursor-pointer"
                    >
                        Toggle Sidebar
                    </button>
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
                                <div className="flex">
                                    <button
                                        onClick={() => {
                                            sessionStorage.setItem(
                                                'mode',
                                                'grant'
                                            );
                                            setMode('grant');
                                        }}
                                        className={
                                            (mode === 'grant'
                                                ? 'bg-primary'
                                                : 'bg-neutral-600') +
                                            ' cursor-pointer w-[50%] text-center mr-1 p-2 text-dark'
                                        }
                                    >
                                        Grants
                                    </button>
                                    <button
                                        onClick={() => {
                                            sessionStorage.setItem(
                                                'mode',
                                                'tag'
                                            );
                                            setMode('tag');
                                        }}
                                        className={
                                            (mode === 'tag'
                                                ? 'bg-primary'
                                                : 'bg-neutral-600') +
                                            ' cursor-pointer w-[50%] text-center ml-1 p-2 text-dark'
                                        }
                                    >
                                        Tags
                                    </button>
                                </div>
                                <Link
                                    to="/admin/new"
                                    className="w-full justify-left flex justify-start p-2 bg-neutral-800"
                                >
                                    <div className="align-middle">
                                        <p className="text-white text-lg">
                                            + Create New!
                                        </p>
                                    </div>
                                </Link>
                                {mode === 'tag' ? (
                                    <AdminTagList />
                                ) : (
                                    <AdminPostList />
                                )}
                            </ul>
                        </div>
                    </aside>
                )}
                <main className="md:m-14 flex-1">
                    <>
                        {isTag && (
                            <div className="p-2 text-white">Hi</div>
                            )}
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
                                    <h1 className="p-4 max-w-48 text-3xl inline-block text-white">
                                        <input
                                            className="bg-neutral-800 p-4 rounded shadow-lg min-w-48"
                                            type="text"
                                            ref={titleRef}
                                            defaultValue={
                                                grant?.name ||
                                                'Enter a Grant Name'
                                            }
                                        ></input>
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
                                    <TextInput
                                        name="ID"
                                        defaultValue={
                                            isNew ? grant_id : grant?.id
                                        }
                                        ref={idRef}
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
                                        rows={8}
                                        defaultValue={
                                            isNew ? '' : grant?.description
                                        }
                                    ></textarea>
                                </div>
                                <div>
                                    <span
                                        onClick={async () => await uploadData()}
                                    >
                                        <SaveButton
                                            isAdmin={isAdmin}
                                            loading={false}
                                        />
                                    </span>
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
