(function (arr) {

    var trim = ''.trim || function () {
        return this.replace(/^\s+|\s+$/g, '');
    };

    function appendRow(row) {
        this.appendChild(row);
    }

    // es5 shim is broken
    function slice(what, start) {
        for (var j = 0, i = start || 0, arr = []; i < what.length; i++) {
            arr[j++] = what[i];
        }
        return arr;
    }

    function SorTable(self) {
        self = HTMLTableElement.call(this, self);
        for (var
            th = self.querySelectorAll('[data-sort-by]'),
            i = 0; i < th.length; i++
        ) {
            th[i].addEventListener('click', self);
        }
        return self;
    }

    SorTable.prototype = Object.create(
        HTMLTableElement.prototype,
        {
            constructor: {value: SorTable, configurable: true},
            handleEvent: {value: function handleEvent(e) {
                return this[e.type](e);
            }},
            click: {value: function click(e) {
                e.preventDefault();
                var
                    self = this,
                    th = e.currentTarget,
                    doc = self.ownerDocument,
                    tbody = self.querySelector('tbody'),
                    order = (th.getAttribute('data-sort-order') || 'asc').toLowerCase(),
                    direction = order === 'asc' ? 1 : -1,
                    columns = th.parentNode.querySelectorAll(th.nodeName),
                    index = arr.indexOf.call(columns, th),
                    sortBy = th.getAttribute('data-sort-by'),
                    method = sortBy ?
                        sortBy.split('.').reduce(
                            function (o, m) { return o[m]; },
                            doc.defaultView || doc.parentWindow
                        ) :
                        function (a, b) {
                            return a === b ? 0 :(a < b ? -1 : 1);
                        }
                ;
                slice(tbody.querySelectorAll('tr'), 1).sort(
                    function (a, b) {
                        return direction * method.call(
                            self,
                            trim.call(a.querySelectorAll('td')[index].textContent),
                            trim.call(b.querySelectorAll('td')[index].textContent)
                        );
                    }
                ).forEach(appendRow, tbody);
                th.setAttribute(
                    'data-sort-order',
                    order === 'asc' ? 'desc' : 'asc'
                );
            }}
        }
    );

    customElements.define(
        'sor-table',
        SorTable,
        {'extends': 'table'}
    );

}(Array.prototype));