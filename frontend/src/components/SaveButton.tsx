import { FC } from 'react';
import { Spinner } from './Spinner';

export const SaveButton: FC<{ isAdmin: boolean; loading: boolean }> = ({
    isAdmin,
    loading,
}) => {
    return (
        <button
            className="bg-primary text-black focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-6"
            type="submit"
            disabled={!isAdmin}
        >
            {loading ? <Spinner /> : isAdmin ? 'SAVE' : 'No Permission'}
        </button>
    );
};
