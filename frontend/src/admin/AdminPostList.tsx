import { FC } from 'react';
import useSWR from 'swr';

import { GrantProgram } from '../../../backend/src/grant.type';
import { GLOBALS } from '..';

export const AdminPostList: FC = () => {
    const { data, error } = useSWR('/api/all', async () => {
        const request = await fetch(GLOBALS.API_URL + '/all');

        return (await request.json()) as {
            total: number;
            documents: { id: string; value: GrantProgram }[];
        };
    });

    if (error) return <div>Error loading data</div>;

    if (!data) return <div>Loading...</div>;

    return (
        <>
            {data.documents.map((program) => (
                <div
                    key={program.value.id}
                    onClick={() => {console.log(program.value)}}
                    className="w-full justify-left flex justify-start pt-4"
                >
                    <img
                        className="h-8 mr-2 aspect-square rounded-full"
                        src={program.value.image_url ? program.value.image_url : 'http://localhost:1234/favicon.09ab7678.png'}
                    ></img>
                    <div className="align-middle">
                        <p className="text-white text-sm">
                            {program.value.name}
                        </p>
                        <p className="text-gray-600 text-xs">Last updated 33 seconds ago<br/> by Jonte</p>
                    </div>
                </div>
            ))}
        </>
    );
};
