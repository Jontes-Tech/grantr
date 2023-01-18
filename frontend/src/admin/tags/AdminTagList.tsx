import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { GLOBALS } from '../..';
import { GrantProgram } from '../../../../backend/src/grant.type';
import { Tag } from '../../../../backend/src/tag.type';

export const AdminTagList: FC = () => {
    const { data, error } = useSWR('/api/tags/list', async () => {
        const request = await fetch(GLOBALS.API_URL + '/tags/list');

        return (await request.json()) as Record<string, Tag>;
    });
    const { id } = useParams();

    if (error) return <div>Error loading data</div>;

    if (!data) return <div>Loading...</div>;

    return (
        <>
            {Object.entries(data).map(([key, tag]) => (
                <Link
                    key={key}
                    to={'/admin/tag/' + key}
                    className={`w-full justify-left flex justify-start p-2 ${key === id ? 'bg-neutral-700 rounded-md shadow-md' : ''}`}
                >
                    <div className="align-middle">
                        <p className="text-white text-sm">
                            {tag.name}
                        </p>
                        <p className={`text-xs hidden sm:block ${key === id ? 'text-gray-400' : 'text-gray-700'}`}>
                            {/* TODO: Implement these APIs */}
                            Last updated {"33 seconds"} ago
                            <br /> by {"jontes.eth"}
                        </p>
                    </div>
                </Link>
            ))}
        </>
    );
};
