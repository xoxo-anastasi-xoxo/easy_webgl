class OBJLoader {
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
    }

    calculateNormals() {
        if (!(this.vertices.length && this.indices.length))
            return [];

        this.normals = new Array(this.vertices.length);
        for (let i = 0; i < this.indices.length; i += 3) {
            let v1 = [
                this.vertices[this.indices[i + 2] * 3] - this.vertices[this.indices[i + 1] * 3],
                this.vertices[this.indices[i + 2] * 3 + 1] - this.vertices[this.indices[i + 1] * 3 + 1],
                this.vertices[this.indices[i + 2] * 3 + 2] - this.vertices[this.indices[i + 1] * 3 + 2]
            ];
            let v2 = [
                this.vertices[this.indices[i] * 3] - this.vertices[this.indices[i + 1] * 3],
                this.vertices[this.indices[i] * 3 + 1] - this.vertices[this.indices[i + 1] * 3 + 1],
                this.vertices[this.indices[i] * 3 + 2] - this.vertices[this.indices[i + 1] * 3 + 2]
            ];
            let result = [
                v1[1] * v2[2] - v1[2] * v2[1],
                v1[2] * v2[0] - v1[0] * v2[2],
                v1[0] * v2[1] - v1[1] * v2[0]
            ];
            result = Algebra.normalize(result);

            this.normals[this.indices[i] * 3] = result[0];
            this.normals[this.indices[i] * 3 + 1] = result[1];
            this.normals[this.indices[i] * 3 + 2] = result[2];

            this.normals[this.indices[i + 1] * 3] = result[0];
            this.normals[this.indices[i + 1] * 3 + 1] = result[1];
            this.normals[this.indices[i + 1] * 3 + 2] = result[2];

            this.normals[this.indices[i + 2] * 3] = result[0];
            this.normals[this.indices[i + 2] * 3 + 1] = result[1];
            this.normals[this.indices[i + 2] * 3 + 2] = result[2];
        }
    }

    parse(objectData) {
        let self = this;

        /*
        The OBJ file format does a sort of compression when saving a model in a
        program like Blender. There are at least 3 sections (4 including textures)
        within the file. Each line in a section begins with the same string:
          * 'v': indicates vertex section
          * 'vn': indicates vertex normal section
          * 'f': indicates the faces section
          * 'vt': indicates vertex texture section (if textures were used on the model)
        Each of the above sections (except for the faces section) is a list/set of
        unique vertices.
        Each line of the faces section contains a list of
        (vertex, [texture], normal) groups.
        **Note:** The following documentation will use a capital "V" Vertex to
        denote the above (vertex, [texture], normal) groups whereas a lowercase
        "v" vertex is used to denote an X, Y, Z coordinate.
        Some examples:
            // the texture index is optional, both formats are possible for models
            // without a texture applied
            f 1/25 18/46 12/31
            f 1//25 18//46 12//31
            // A 3 vertex face with texture indices
            f 16/92/11 14/101/22 1/69/1
            // A 4 vertex face
            f 16/92/11 40/109/40 38/114/38 14/101/22
        The first two lines are examples of a 3 vertex face without a texture applied.
        The second is an example of a 3 vertex face with a texture applied.
        The third is an example of a 4 vertex face. Note: a face can contain N
        number of vertices.
        Each number that appears in one of the groups is a 1-based index
        corresponding to an item from the other sections (meaning that indexing
        starts at one and *not* zero).
        For example:
            `f 16/92/11` is saying to
              - take the 16th element from the [v] vertex array
              - take the 92nd element from the [vt] texture array
              - take the 11th element from the [vn] normal array
            and together they make a unique vertex.
        Using all 3+ unique Vertices from the face line will produce a polygon.
        Now, you could just go through the OBJ file and create a new vertex for
        each face line and WebGL will draw what appears to be the same model.
        However, vertices will be overlapped and duplicated all over the place.
        Consider a cube in 3D space centered about the origin and each side is
        2 units long. The front face (with the positive Z-axis pointing towards
        you) would have a Top Right vertex (looking orthogonal to its normal)
        mapped at (1,1,1) The right face would have a Top Left vertex (looking
        orthogonal to its normal) at (1,1,1) and the top face would have a Bottom
        Right vertex (looking orthogonal to its normal) at (1,1,1). Each face
        has a vertex at the same coordinates, however, three distinct vertices
        will be drawn at the same spot.
        To solve the issue of duplicate Vertices (the `(vertex, [texture], normal)`
        groups), while iterating through the face lines, when a group is encountered
        the whole group string ('16/92/11') is checked to see if it exists in the
        packed.hashindices object, and if it doesn't, the indices it specifies
        are used to look up each attribute in the corresponding attribute arrays
        already created. The values are then copied to the corresponding unpacked
        array (flattened to play nice with WebGL's ELEMENT_ARRAY_BUFFER indexing),
        the group string is added to the hashindices set and the current unpacked
        index is used as this hashindices value so that the group of elements can
        be reused. The unpacked index is incremented. If the group string already
        exists in the hashindices object, its corresponding value is the index of
        that group and is appended to the unpacked indices array.
       */

        const verticesList = [];
        const normalsList = [];
        const unpacked = {};

        // unpacking stuff
        unpacked.verts = [];
        unpacked.norms = [];
        unpacked.indices = [];
        unpacked.heshes = {};

        const VERTEX_RE = /^v\s/;
        const NORMAL_RE = /^vn\s/;
        const FACE_RE = /^f\s/;
        const WHITESPACE_RE = /\s+/;
        const all_meaning_re = [VERTEX_RE, NORMAL_RE, FACE_RE];

        // Массив строк нашей модели
        const lines = objectData.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Отбрасываем все неподходящие строки
            if (!line || line.startsWith("#") || !all_meaning_re.some((re) => re.test(line))) {
                continue;
            }

            // Делим строку по пробелу и получаем массив необходимых нам значений
            const elements = line.split(WHITESPACE_RE);
            elements.shift();

            if (VERTEX_RE.test(line)) {
                // Обрабатываем вершину.
                elements.length = 3; // т.к. иногда вершина может содержать дополнительную, ненужную нам информацию.
                verticesList.push(...(elements).map(value => parseFloat(value)));
            } else if (NORMAL_RE.test(line)) {
                // Обрабатываем нормаль.
                normalsList.push(...(elements).map(value => parseFloat(value)));
            } else if (FACE_RE.test(line)) {
                // Это плоскость одного из 4ех видов
                // ['16/92/11', '14/101/22', '1/69/1'] - даны и вершина, и текстура, и нормаль
                // ['16//11', '14//22', '1//1'] - даны вершина и нормаль
                // ['16/92', '14/101', '1/69'] - даны вершина и текстура
                // ['16', '14', '1'] - дана только вершина


                let data = elements[0].split('/');
                let hash = (data.length > 2) ? data[0] + "/" + data[2] : data[0];
                let first = (unpacked.heshes[hash]) ? unpacked.heshes[hash] : parseInt(unpacked.verts.length / 3);
                let current, last;

                for (let j = 0; j < elements.length; ++j) {

                    data = elements[j].split('/');

                    if (data.length > 2) {
                        hash = data[0] + "/" + data[2];
                        if (unpacked.heshes[hash]) {
                            current = unpacked.heshes[hash];
                        } else {
                            current = parseInt(unpacked.verts.length / 3);

                            unpacked.verts.push(
                                verticesList[(parseInt(data[0]) - 1) * 3],
                                verticesList[(parseInt(data[0]) - 1) * 3 + 1],
                                verticesList[(parseInt(data[0]) - 1) * 3 + 2]
                            );

                            unpacked.norms.push(
                                normalsList[(parseInt(data[2]) - 1) * 3],
                                normalsList[(parseInt(data[2]) - 1) * 3 + 1],
                                normalsList[(parseInt(data[2]) - 1) * 3 + 2]
                            );

                            unpacked.heshes[hash] = current;
                        }
                    } else {
                        current = parseInt(unpacked.verts.length / 3);

                        unpacked.verts.push(
                            verticesList[(parseInt(data[0]) - 1) * 3],
                            verticesList[(parseInt(data[0]) - 1) * 3 + 1],
                            verticesList[(parseInt(data[0]) - 1) * 3 + 2]
                        );
                    }
                    if (j < 3) {
                        unpacked.indices.push(current);
                    } else {
                        unpacked.indices.push(first, last, current);
                    }

                    last = current;
                }
            }
        }

        self.vertices = unpacked.verts;
        self.normals = unpacked.norms;
        self.indices = unpacked.indices;

        if (self.vertices.length !== self.normals.length)
            this.calculateNormals(self.vertices, self.indices);

        console.log(this.normals);
        console.log(this.indices);
        console.log(this.vertices);
    }
}