#!/usr/bin/env python3

import collections
import json
import pathlib


def main():
    root = pathlib.Path(__file__).parent
    public_root = root / 'public'
    index = collections.defaultdict(list)
    for path in (public_root / 'trees').rglob('*.jpg'):
        key = path.name.split('_')[0]
        index[key].append(str(path.relative_to(public_root)))
    data = {
        key: sorted(values)
        for key, values in index.items()
    }
    index_file = root / 'src' / 'data' / 'TreeImages.json'
    json.dump(data, index_file.open('w'))


if __name__ == '__main__':
    main()