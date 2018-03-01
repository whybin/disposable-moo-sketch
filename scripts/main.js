(function (Aframe, Three) {
    class Ploder {
        constructor (mesh, variance, delay) {
            this._mesh = mesh;
            this._variance = variance;
            this._wait = this._delay = delay;
            this._originalPos = this.attr.array;
        }

        get attr () {
            return this._mesh.geometry.getAttribute('position');
        }

        get array () {
            return this.attr.array;
        }

        set array (arr) {
            this.attr.setArray(arr);
            this.attr.needsUpdate = true;
        }

        restore () {
            this.array = this._originalPos;
            this._wait = this._delay;
        }

        tick () {
            if (this._wait > 0) {
                --this._wait;
                return;
            }

            this.array = this.array.map(val =>
                val + Math.random() * 2 * this._variance - this._variance);
            this._variance += 0.001;
        }
    }

    Aframe.registerComponent('ploder', {
        schema: {
            variance: { type: 'number', default: 0.1 },
            delay: { type: 'number', default: 300 }
        },
        init: function () {
            this.el.addEventListener('mouseenter', () => {
                if (this._ploder === undefined) {
                    return;
                }

                this._ploder.restore();
            });
        },
        tick: function () {
            if (this._ploder === undefined) {
                let mesh = this.el.getObject3D('mesh');
                if (mesh === undefined) {
                    return;
                }

                this._ploder = new Ploder(
                    mesh.children[0], this.data.variance, this.data.delay);
            }

            this._ploder.tick();
        }
    });
})(AFRAME, THREE);
