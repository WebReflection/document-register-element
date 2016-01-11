
var App = React.createClass({
    render: function() {
        return (
            <div>
                <h3>dynamic</h3>
                <x-clock>10:10:30</x-clock>
                <h3>fixed</h3>
                <x-clock hour="10" minute="10" second="30">10:10:30</x-clock>
            </div>
        )
    }
})

ReactDOM.render(<App />, document.body)
