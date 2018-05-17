import React from 'react';
import axios from 'axios';
import LoginDisplay from './loginDisplay';
import NewUser from './newUser';

const blogin = {
    backgroundColor: 'gray'
};
const alogin = {
    backgroundColor: 'beige'
}
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggedIn: false
        };
    }
    handleTextInput = e => {
        e.preventDefault();

        let name = e.target.name
        name = e.target.value;
        console.log(e.target.name)
        console.log(e.target.value)
        this.setState({ [e.target.name]: e.target.value })
    };
    sendCredentials = () => {
        
        let username = this.state.username;
        let password = this.state.password;
        const newObject = {
            username: username,
            password: password
        };
        let userObject = {
            username: username,
            loggedIn: true
        }
        console.log('This is the Authentication Credentials', newObject);
        axios.post('http://localhost:5500/api/login/', newObject)

            .then(res => {
                console.log('this is the response for log in', res);
                this.setState({ credentials: {}, username: '', password: '' });
                if (res) {
                    this.setState({ loggedIn: true })
                }
                this.props.fetchData;

            })
    };
    logout = () => {
        // e.preventDefault();
        console.log('this is the state:', this.state.loggedIn)
        this.setState({ loggedIn: false });
        this.props.fetchData;
    };

    render() {
        return (
            <div>

                {this.state.loggedIn ? <div style={alogin}>
                    <button onClick={() => this.logout()}>
                        Log Out
                    </button>
                    <LoginDisplay /> </div> : <div style={blogin} >
                    <h3>Please Log in</h3> 
                    
                        <input
                            type="text"
                            onChange={this.handleTextInput}
                            placeholder="Enter username"
                            name="username"
                            value={this.state.username}
                        />
                        <input
                            type="text"
                            onChange={this.handleTextInput}
                            placeholder="Enter password"
                            name="password"
                            value={this.state.password}
                        />
                        <button onClick={() => this.sendCredentials()}>
                            Send Credentials
                    </button> 
                    {/* <h3>Or </h3> */}
                    <NewUser />
                    </div>}
            </div>
        )
    }


}

export default Login;