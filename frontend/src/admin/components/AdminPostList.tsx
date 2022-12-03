import { FC } from 'react';
import useSWR from 'swr';

import { GrantProgram } from '../../../../backend/src/grant.type';
import { GLOBALS } from '../..';
import { Link, useParams } from 'react-router-dom';
import notfoundimage from '../../images/notfoundimage.webp'

export const AdminPostList: FC = () => {
    const { data, error } = useSWR('/api/all', async () => {
        const request = await fetch(GLOBALS.API_URL + '/all');

        return (await request.json()) as {
            total: number;
            documents: { id: string; value: GrantProgram }[];
        };
    });

    if (error) return <div>Error loading data</div>;

    const { id } = useParams();

    if (!data) return <div>Loading...</div>;

    return (
        <>
            {data.documents.map((program) => (
                <Link
                    key={program.value.id}
                    to={'/admin/g/' + program.value.id}
                    className={`w-full justify-left flex justify-start p-2 ${program.value.id === id ? 'bg-neutral-700 rounded-md shadow-md' : ''}`}
                >
                    <img
                        className="h-8 mr-2 aspect-square rounded-full"

                        src={
                            program.value.image_url || notfoundimage
                        }
                    ></img>
                    <div className="align-middle">
                        <p className="text-white text-sm">
                            {program.value.name}
                        </p>
                        <p className={`text-xs hidden sm:block ${program.value.id === id ? 'text-gray-400' : 'text-gray-700'}`}>
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
