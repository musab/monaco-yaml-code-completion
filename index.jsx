import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MonacoEditor from "react-monaco-editor";
import "monaco-yaml/lib/esm/monaco.contribution";
import { languages } from "monaco-editor/esm/vs/editor/editor.api";

// NOTE: This will give you all editor featues. If you would prefer to limit to only the editor
// features you want to use, import them each individually. See this example: (https://github.com/microsoft/monaco-editor-samples/blob/master/browser-esm-webpack-small/index.js#L1-L91)
import "monaco-editor";

// NOTE: using loader syntax becuase Yaml worker imports editor.worker directly and that
// import shouldn't go through loader syntax.
import EditorWorker from "worker-loader!monaco-editor/esm/vs/editor/editor.worker";
import YamlWorker from "worker-loader!monaco-yaml/lib/esm/yaml.worker";

window.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === "yaml") {
      return new YamlWorker();
    }
    return new EditorWorker();
  },
};

const { yaml } = languages || {};

console.log(languages);

const Editor = () => {
  const [value, setValue] = useState("");
  useEffect(() => {
    yaml &&
      yaml.yamlDefaults.setDiagnosticsOptions({
        validate: true,
        enableSchemaRequest: true,
        hover: true,
        completion: true,
        enableSchemaRequest: true,
        format: true,
        schemas: [
          {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: "JSON Schema for Hadolint, a Dockerfile linter tool",
            description:
              "Dockerfile linter, validate inline bash, written in Haskell",
            type: "object",
            additionalProperties: false,
            properties: {
              ignored: {
                type: "array",
                description: "A list of rules to be ignored",
                items: {
                  type: "string",
                  oneOf: [
                    {
                      const: "DL3000",
                      description: "Use absolute WORKDIR.",
                    },
                    {
                      const: "DL3001",
                      description:
                        "For some bash commands it makes no sense running them in a Docker container like ssh, vim, shutdown, service, ps, free, top, kill, mount, ifconfig.",
                    },
                    {
                      const: "DL3002",
                      description: "Last user should not be root.",
                    },
                    {
                      const: "DL3003",
                      description: "Use WORKDIR to switch to a directory.",
                    },
                    {
                      const: "DL3004",
                      description:
                        "Do not use sudo as it leads to unpredictable behavior. Use a tool like gosu to enforce root.",
                    },
                    {
                      const: "DL3005",
                      description:
                        "Do not use apt-get upgrade or dist-upgrade.",
                    },
                  ],
                  title: "Rule",
                },
              },
              trustedRegistries: {
                type: "array",
                description: "A list of trusted registries. Ex: docker.io",
                items: {
                  type: "string",
                },
              },
            },
          },
        ],
      });
  }, []);

  return (
    <MonacoEditor
      width="800"
      height="600"
      language="yaml"
      value={value}
      onChange={setValue}
    />
  );
};

ReactDOM.render(<Editor />, document.getElementById("react"));
