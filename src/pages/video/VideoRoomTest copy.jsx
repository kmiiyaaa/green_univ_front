export default function VideoRoomTest() {
	return (
		<>
			<nav className="navbar navbar-default navbar-static-top"></nav>

			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="page-header">
							<h1>
								화상회의
								<button className="btn btn-default" autoComplete="off" id="start">
									Start
								</button>
							</h1>
						</div>
						<div className="container" id="details">
							<div className="row">
								<div className="col-md-12">
									<h3>Start 버튼을 누르고 데모를 시작하세요</h3>
									<h4>채팅방 ID로 기존 채팅방을 연결하거나 새로 생성합니다.</h4>
									<h4>* ID는 영문 또는 숫자로 입력해야 합니다.</h4>
								</div>
							</div>
						</div>
						<div className="container hide" id="videojoin">
							<div className="row">
								<div className="col-md-12" id="controls">
									<div id="registernow">
										<span className="label label-info" id="room"></span>
										<div className="input-group margin-bottom-md">
											<input
												autoComplete="off"
												className="form-control"
												type="text"
												placeholder="Room Name"
												id="roomname"
											/>
										</div>
										<span className="label label-info" id="you"></span>
										<div className="input-group margin-bottom-md ">
											<span className="input-group-addon">대화명</span>
											<input
												autoComplete="off"
												className="form-control"
												type="text"
												placeholder="My Name"
												id="username"
												// onKeyPress="return checkEnter(this, event);"
											/>
											<span className="input-group-btn">
												<button className="btn btn-success" autoComplete="off" id="register">
													대화방 참여
												</button>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="container hide" id="videos">
							<div className="row">
								<div className="col-md-4">
									<div className="panel panel-default">
										<div className="panel-heading">
											<h3 className="panel-title">
												Local Video <span className="label label-primary hide" id="publisher"></span>
												<div className="btn-group btn-group-xs pull-right hide">
													<div className="btn-group btn-group-xs">
														<button
															id="bitrateset"
															autoComplete="off"
															className="btn btn-primary dropdown-toggle"
															data-toggle="dropdown"
														>
															Bandwidth<span className="caret"></span>
														</button>
														<ul id="bitrate" className="dropdown-menu" role="menu">
															<li>
																<a href="#" id="0">
																	No limit
																</a>
															</li>
															<li>
																<a href="#" id="128">
																	Cap to 128kbit
																</a>
															</li>
															<li>
																<a href="#" id="256">
																	Cap to 256kbit
																</a>
															</li>
															<li>
																<a href="#" id="512">
																	Cap to 512kbit
																</a>
															</li>
															<li>
																<a href="#" id="1024">
																	Cap to 1mbit
																</a>
															</li>
															<li>
																<a href="#" id="1500">
																	Cap to 1.5mbit
																</a>
															</li>
															<li>
																<a href="#" id="2000">
																	Cap to 2mbit
																</a>
															</li>
														</ul>
													</div>
												</div>
											</h3>
										</div>
										<div className="panel-body" id="videolocal"></div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="panel panel-default">
										<div className="panel-heading">
											<h3 className="panel-title">
												Remote Video #1 <span className="label label-info hide" id="remote1"></span>
											</h3>
										</div>
										<div className="panel-body relative" id="videoremote1"></div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="panel panel-default">
										<div className="panel-heading">
											<h3 className="panel-title">
												Remote Video #2 <span className="label label-info hide" id="remote2"></span>
											</h3>
										</div>
										<div className="panel-body relative" id="videoremote2"></div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4">
									<div className="panel panel-default">
										<div className="panel-heading">
											<h3 className="panel-title">
												Remote Video #3 <span className="label label-info hide" id="remote3"></span>
											</h3>
										</div>
										<div className="panel-body relative" id="videoremote3"></div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="panel panel-default">
										<div className="panel-heading">
											<h3 className="panel-title">
												Remote Video #4 <span className="label label-info hide" id="remote4"></span>
											</h3>
										</div>
										<div className="panel-body relative" id="videoremote4"></div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="panel panel-default">
										<div className="panel-heading">
											<h3 className="panel-title">
												Remote Video #5 <span className="label label-info hide" id="remote5"></span>
											</h3>
										</div>
										<div className="panel-body relative" id="videoremote5"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<hr />
				<div className="footer"></div>
			</div>
		</>
	);
}
