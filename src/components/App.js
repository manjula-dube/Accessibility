import React, { Component } from 'react'
import { channelData as sourceChannelData } from '../api/apiConfig'
import '../styles/App.css'

class App extends Component {
	constructor() {
		super()
		this.state = {
			channelData: [],
			done: false,
			activeChannel: 0
		}

		this.tabIndexCounter = 0

		this.onKeyDown = this.onKeyDown.bind(this)
		this.addRemove = this.addRemove.bind(this)
	}

	getUniqueChannels(response) {
		const cidObject = {}
		const { channels } = response
		const uniqueChannels = []

		for (let i = 0; i < channels.length; i++) {
			const { cid } = channels[i]
			if (cidObject[cid]) {
				continue
			} else {
				uniqueChannels.push(channels[i])
			}
			cidObject[cid] = cid
		}

		response.channels = uniqueChannels

		return response
	}

	componentDidMount() {
		fetch(sourceChannelData)
			.then(response => response.json())
			.then(response => this.getUniqueChannels(response))
			.then(data => this.setState({ channelData: data.channels, done: true }, this.setFocus))
	}

	addRemove(cid) {
		const { channelData } = this.state
		const clonedChannelData = Object.assign([], channelData)

		const matchedChannel = clonedChannelData.find(_ => _.cid === cid)
		if (matchedChannel) {
			matchedChannel.isFavourite = !matchedChannel.isFavourite
		}

		this.setState({
			channelData: clonedChannelData
		})
	}

	onKeyDown(event) {
		const { keyCode } = event
		const tabIndex = +event.target.getAttribute('tabIndex')
		const cid = event.target.getAttribute('cid')
		console.log(tabIndex)
		switch (keyCode) {
			case 13:
				this.addRemove(cid)
				// Enter
				break
			case 37:
				this.setState(
					{
						activeChannel: tabIndex <= 0 ? 0 : tabIndex - 1
					},
					this.setFocus
				)
				//left
				break
			case 38:
				this.setState(
					{
						activeChannel: tabIndex <= 2 ? 0 : tabIndex - 2
					},
					this.setFocus
				)
				// up
				break
			case 39:
				this.setState(
					{
						activeChannel: tabIndex + 1
					},
					this.setFocus
				)
				//right
				break
			case 40:
				this.setState(
					{
						activeChannel: tabIndex + 2
					},
					this.setFocus
				)
				//down
				break
			default:
				break
		}
	}

	setFocus() {
		const { activeChannel } = this.state
		const channelToFocus = this[`channel${activeChannel}`]

		if (channelToFocus) {
			channelToFocus.focus()
		}
	}

	renderChannel(channel, index) {
		const { activeChannel } = this.state
		return (
			<div
				className={`channel width30margin ${activeChannel === index ? 'active' : ''} ${
					channel.isFavourite ? 'channel-favourite' : ''
				}`}
				key={channel.cid}
				tabIndex={index}
				cid={channel.cid}
				onKeyDown={this.onKeyDown}
				ref={ref => (this[`channel${index}`] = ref)} // eslint-disable-line
			>
				<img src={`https://logos.zattic.com${channel.qualities[0].logo_white_84}`} className='image-logo' />
				<span className='_sort'>{index.toString().padStart(3, '0')}</span>
				<span className='title'>{channel.title}</span>
			</div>
		)
	}

	renderFavouriteChannel(channel, index) {
		return (
			<div
				className={`channel width45margin ${channel.isFavourite ? 'channel-favourite' : ''}`}
				key={channel.cid}
				tabIndex={index}
				cid={channel.cid}
				ref={ref => (this[`fav-channel${index}`] = ref)} // eslint-disable-line
			>
				<img src={`https://logos.zattic.com${channel.qualities[0].logo_white_84}`} className='image-logo' />
				<span className='_sort'>{index.toString().padStart(3, '0')}</span>
				<span className='title'>{channel.title}</span>
			</div>
		)
	}

	render() {
		this.tabIndexCounter = 0
		const channelDataArray = this.state.channelData
		return (
			<div className='container'>
				<section className='section1'>
					<h4 className='header-sec1'>Favourite channels</h4>
					{this.state.done &&
						channelDataArray.map((channel, index) => {
							if (channel.isFavourite) {
								return this.renderFavouriteChannel(channel, index)
							} else {
								return null
							}
						})}
				</section>
				<section className='section2'>
					<h4 className='header-sec2'>All channels</h4>
					{this.state.done && channelDataArray.map((channel, index) => this.renderChannel(channel, index))}
				</section>
			</div>
		)
	}
}

export default App
