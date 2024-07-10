import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';
import { Formio } from 'formiojs';
import "formiojs/dist/formio.full";
import "formiojs/dist/formio.full.min.css";
import "formiojs/dist/formio.full.min.js";
import "formiojs/dist/formio.form.css";
import "bootstrap/dist/css/bootstrap.min.css";
import RenderedForm from './RenderedForm';

Modal.setAppElement('#root'); // Required for accessibility


import { Form, FormBuilder } from '@formio/react';


const App = () => {
  const [builder, setBuilder] = useState(null);
  const [jsonOutput, setJsonOutput] = useState(null);

  // useEffect(() => {
  //   Formio.builder(document.getElementById('builder'), {}, {
  //     builder: {
  //       resource: false,
  //       premium: false,
  //       data: false,
  //       basic: {
  //         title: 'Basic',
  //         weight: 0,
  //         default: true,
  //       },
  //       advanced: {
  //         // title: 'Advanced',
  //         // weight: 10,
  //         components: {
  //           survey: false,
  //           day: false,
  //           currency: false,
  //           url: false,
  //           address: false,
  //           tags: false
  //         }
  //       },
  //       layout: {
  //         // title: 'Layout',
  //         // weight: 20,
  //         components: {
  //           htmlelement: false,
  //           content: false,
  //           well: false,
  //           tabs: false
  //         }
  //       },

  //     },
  //   }).then((builderInstance) => {
  //     setBuilder(builderInstance);
  //   });

  // }, []);

  useEffect(() => {
    Formio.builder(document.getElementById('builder'), {}, {
      builder: {
        resource: false,
        premium: false,
        data: false,
        basic: false,
        advanced: false,
        layout: false,
        custom: {
          title: 'Fields',
          weight: 10,
          default: true,
          components: {
            textfield: true,
            textarea: true,
            checkbox: true,
            select: true,
            radio: true,
            date: true,
            number: true,
            datetime: true,
            signature: true,
            panel: true,
            password: true,
            button: true,
          }
        }
      },
    }).then((builderInstance) => {
      setBuilder(builderInstance);
    });
  }, []);


  const getJsonOutput = () => {
    if (builder) {
      const formSchema = builder.schema;
      setJsonOutput(formSchema);
      console.log(formSchema);
    }
  };



  return (
    <div className="p-4 w-full flex flex-col">
      <div id="builder" className="flex-grow overflow-auto w-[90vw] h-[80vh] mb-4 border border-gray-300">
      </div>
      <button onClick={getJsonOutput} className="p-2 mt-4 bg-blue-500 text-white rounded">
        Preview
      </button>
      {jsonOutput && (
        <pre className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded overflow-auto ">
          {JSON.stringify(jsonOutput, null, 2)}
        </pre>
      )}
      {jsonOutput && (
        <RenderedForm formSchema={jsonOutput} />
      )}
    </div>
  );
};

export default App;
