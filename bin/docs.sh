#!/usr/bin/bash

set -e

function main()
{
    local section="$1"

    case $section in
        predicates)
            generate_predicates;;
        *)
            echo "usage: ./bin/docs.sh <section>";;
    esac
}

function generate_predicates()
{
    local section=$1

    local cmd='file="${0}" && \
          grep "$(basename ${file%.*}) ::" "$file" | \
          sed -E "s/\s*\/\*\* (.*) :: (.*) \*\//| [\`\1\`][\1] | \`\2\` | \`crocks\/predicates\/\1\` |/"'

    local predicates=$(find "./src/predicates/" \
                            -name "*.js" \
                            -not -name "*.spec.js}" \
                            -exec bash -c "$cmd" {} \;)

    local core=$(find "./src/core/" \
                      -name "*.js" \
                      -not -name "*.spec.js}" \
                      -exec bash -c "$cmd" {} \;)

    local manualAppend='| [`propPathEq`][propPathEq] | `[ String | Number ] -> a -> Object -> Boolean` | `crocks/predicates/propPathEq` |\n| [`propPathSatisfies`][propPathSatisfies] | `[ (String | Integer) ] -> (a -> Boolean) -> b -> Boolean` | `crocks/predicates/propPathSatisfies` |'

    echo -e "${predicates}\n${core}\n${manualAppend}" | sort
}

main "$@"
