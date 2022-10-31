import { FC } from 'react';
import { AdminPostList } from './AdminPostList';

export const Admin: FC = () => {
    return (
        <div>
            {/* React requires me to make this div here :jonteshrug: */}
            <div className="flex">
                {/* This is the div for everthing except the navbar */}
                <aside
                    className="w-72 h-full border-r-2 border-gray-600"
                    aria-label="Sidebar"
                >
                    <div className="overflow-y-auto py-4 px-3 bg-dark rounded border-white">
                        <ul className="space-y-2">
                            <p className="bg-primary text-center p-2 border-gray-600 border-4">
                                Grants
                            </p>
                            <AdminPostList />
                        </ul>
                    </div>
                </aside>
                <main className="m-10">
                    <h1 className="text-white text-4xl">Jonte is very epic :)</h1>
                    <p className='text-gray-400'>Here we need to add the content later, oh and also we gotta add a navbar!</p>
                </main>
            </div>
        </div>
    );
};
