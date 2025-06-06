// @features/teacher/student/StudentSearchBar.tsx
import React from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const StudentSearchBar: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded shadow-sm"
            />
        </div>
    );
};

export default StudentSearchBar;