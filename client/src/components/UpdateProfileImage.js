import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import sha1 from 'sha1'
import superagent from 'superagent'

class UpdateImage extends React.Component {
  constructor(props) {
    super(props);

    }

  uploadImage (files) {
  	const image = files[0];

  	const cloudName = 'hr-82';
  	const url = 'https://api.cloudinary.com/v1_1/'+ cloudName +'/image/upload'

  	const timestamp = Date.now()/1000
  	const uploadPreset = 'rggovxew'

  	const paramsStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+process.env.PRESET;

  	const signature = sha1(paramsStr)

  	const params = {
  		'api_key': process.env.KEY,
  		'timestamp': timestamp,
  		'crop': `fill, width: 150, height: 100`,
  		'upload_preset': uploadPreset,
  		'signature': signature
  	}

  	let uploadRequest = superagent.post(url)
  	uploadRequest.attach('file', image)

  	Object.keys(params).forEach((key) => {
  		uploadRequest.field(key, params[key])
  	})

  	uploadRequest.end((err, resp)=> {
  		if(err) {
  			alert(err)
  			return
  		}

  		this.changeImage(resp.body.url)

  	})

  }

  changeImage (url) {

  	this.props.changePicture(url)

  	var id = this.props.current
  	this.props.sendImage(url)


  }


  render() {
     return (
       <Modal trigger={ this.props.currentUser.id === this.props.user.id ? <Button>Edit Photo</Button> : null}>
			    <Modal.Header>Select a Photo</Modal.Header>
			    <Modal.Content image>
			      <div>
			      <Dropzone onDrop={this.uploadImage.bind(this)}/>
			      </div>
			      <Modal.Description id='modalDescription'>
			        <Header>Upload Profile Image</Header>
			        <p>We've found the following gravatar image associated with your e-mail address.</p>
			        <p>Is it okay to use this photo?</p>
			      </Modal.Description>
			    </Modal.Content>
			  </Modal>
     );
   }
}

export default UpdateImage
