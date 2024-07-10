import React, { useEffect, useRef } from 'react';
import { Formio } from 'formiojs';

const RenderedForm = ({ formSchema }) => {
    const formRef = useRef(null);

    useEffect(() => {
        if (formSchema) {
            Formio.createForm(formRef.current, formSchema)
        }
    }, [formSchema]);

    return (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded overflow-auto">
            <div ref={formRef}></div>
        </div>
    );
};

export default RenderedForm;
