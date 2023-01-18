import * as React from 'react';
import { GrantProgram } from '../../../../backend/src/grant.type';
import { Grant } from '../../grant/Grant';

export const Modal = (grant:GrantProgram) => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <>
            <button
                className="bg-neutral-500 text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Preview
            </button>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[220] outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-800 outline-none focus:outline-none">
                                {grant.description}
                                <div className="flex items-center justify-end p-6 rounded-b">
                                    <button
                                        className="bg-primary text-dark active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Looks good, Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
