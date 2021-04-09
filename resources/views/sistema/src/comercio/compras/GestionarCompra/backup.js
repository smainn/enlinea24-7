


const vard = (
    <div className='row' style={{boxSizing: 'border-box', width: '100%'}}>
                <div style={{width: 1200, padding: 10, margin: 'auto', marginTop: 50, border: '1px dashed black', display: 'block'}}>
                    <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                        <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>ANALISIS DE TRATAMIENTO DE PACIENTE</strong>
                    </div>
                    <div style={{width: '100%', display: 'flex'}}>
                        <div style={{width: '50%', padding: 10, border: '1px dashed black', display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
                            <div style={{padding: 20,}}>
                                <Menu
                                    style={{width: 200, border: '1px dashed #e8e8e8'}}
                                    mode='inline'
                                >
                                    <Menu.SubMenu
                                        key='sub1'
                                        title={<span>ENFERMEDAD</span>}
                                    >
                                        <Menu.Item key='1'>
                                            ID/COD
                                        </Menu.Item>
                                        <Menu.Item key='2'>
                                            NOMBRE
                                        </Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu
                                        key='sub2'
                                        title={<span>PACIENTE</span>}
                                    >
                                        <Menu.Item key='3'>
                                            ID/COD
                                        </Menu.Item>
                                        <Menu.Item key='4'>
                                            NOMBRE
                                        </Menu.Item>
                                        <Menu.Item key='5'>
                                            GENERO
                                        </Menu.Item>
                                        <Menu.Item key='6'>
                                            EDAD
                                        </Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu
                                        key='sub3'
                                        title={<span>ZONA</span>}
                                    >
                                        <Menu.Item key='7'>
                                            ID/COD
                                        </Menu.Item>
                                        <Menu.Item key='8'>
                                            NOMBRE
                                        </Menu.Item>
                                    </Menu.SubMenu>
                                    <Menu.SubMenu
                                        key='sub4'
                                        title={<span>TIEMPO</span>}
                                    >
                                        <Menu.Item key='9'>
                                            DIA
                                        </Menu.Item>
                                        <Menu.Item key='10'>
                                            SEMANA
                                        </Menu.Item>
                                        <Menu.Item key='11'>
                                            MES
                                        </Menu.Item>
                                        <Menu.Item key='12'>
                                            AÑO
                                        </Menu.Item>
                                    </Menu.SubMenu>
                                </Menu>
                            </div>
                            <div style={{position: 'absolute', top: 20, right: 100, textAlign: 'center'}}>
                                ZONA GEOGRAFICA
                            </div>
                            <div style={{width: 200, margin: 'auto', marginTop: 50, height: 200, position: 'relative', 
                                    overflow: 'hidden', boxSizing: 'border-box'}}
                            >
                                <img src='/img/bolivia.png' alt='none' 
                                    style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
                                        width: '100%', height: '100%'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{width: '50%', padding: 10, border: '1px dashed black'}}>
                            <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                                <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>ANALISIS REALIZADO</strong>
                            </div>
                            <div style={{width: '100%', padding: 10, display: 'block'}}>
                                <div style={{width: 250, height: 150, margin: 'auto', marginTop: 5, position: 'relative'}}>
                                    <img src='/img/cuadro1.jpeg'  
                                        style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%'}}
                                    />
                                </div>
                                <div style={{width: 450, margin: 'auto', marginTop: 5, display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
                                    <div>
                                        <label>Internado: ####%</label>
                                    </div>
                                    <div>
                                        <label>Mortalidad: ####%</label>
                                    </div>
                                    <div>
                                        <label>Recuperado: ####%</label>
                                    </div>
                                </div>
                                <div style={{width: 450, margin: 'auto', marginTop: 5, textAlign: 'center'}}>
                                    <div>
                                        <label>Cantidad Total: ####</label>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: 1200, padding: 10, margin: 'auto', marginTop: 20, border: '1px dashed black', display: 'block', marginBottom: 20,}}>
                    <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                        <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>RESULTADO</strong>
                    </div>
                    <div style={{width: '100%', display: 'flex'}}>
                        <div style={{width: '60%', padding: 10, border: '1px dashed black'}}>
                            <div style={{width: '100%',}}>
                                <Input.Search
                                   style={{width: 180, marginTop: 10, marginBottom: 10, float: 'right'}}
                                   placeholder='Search...'
                                />
                                <Select value='1'
                                    style={{width: 150, marginTop: 10, marginBottom: 10, float: 'left'}}
                                >
                                    <Select.Option value='1'>10</Select.Option>
                                </Select>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={data}
                                bordered={true}
                                pagination={false}
                                className="tables-respons"
                                rowKey="id"
                            />
                        </div>
                        <div style={{width: '40%', padding: 10, border: '1px dashed black'}}>
                            <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                                <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>ANALISIS REALIZADO</strong>
                            </div>
                            <div style={{width: 250, height: 150, margin: 'auto', marginTop: 5, position: 'relative'}}>
                                <img src='/img/cuadro2.jpeg'  
                                    style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: 1200, padding: 10, margin: 'auto', marginTop: 20, border: '1px dashed black', display: 'block', marginBottom: 20,}}>
                    <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                        <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>ANALISIS DE ADMISION DE PACIENTE</strong>
                    </div>
                    <div style={{width: '100%', display: 'flex'}}>
                        <div style={{width: '50%', padding: 10, border: '1px dashed black', display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
                            <div style={{padding: 20,}}>
                                <Tree
                                    showLine={true}
                                    showIcon={true}
                                    style={{maxHeight: 550, overflow: 'scroll', padding: 10, border: '1px dashed black'}}
                                    treeData={[
                                        {
                                            title: 'PACIENTE',
                                            key: '0',
                                            children: [
                                                {title: 'Nombre', key: '00',},
                                                {title: 'Genero', key: '01',},
                                                {title: 'Edad', key: '02',}
                                            ]
                                        },
                                        {
                                            title: 'MEDICO',
                                            key: '1',
                                            children: [
                                                {
                                                    title: 'Nombre', key: '10',
                                                    title: 'Genero', key: '11',
                                                    title: 'Edad', key: '12',
                                                }
                                            ]
                                        },
                                        {
                                            title: 'ESPECIALIDAD',
                                            key: '2',
                                            children: [
                                                {
                                                    title: 'Nombre', key: '20',
                                                }
                                            ]
                                        },
                                        {
                                            title: 'HOSPITAL',
                                            key: '3',
                                            children: [
                                                {
                                                    title: 'Nombre', key: '30',
                                                }
                                            ]
                                        },
                                        {
                                            title: 'ZONA',
                                            key: '4',
                                            children: [
                                                {
                                                    title: 'Nombre', key: '40',
                                                }
                                            ]
                                        },
                                        {
                                            title: 'TIEMPO',
                                            key: '5',
                                            children: [
                                                {
                                                    title: 'DIA', key: '50',
                                                    title: 'SEMANA', key: '51',
                                                    title: 'MES', key: '52',
                                                }
                                            ]
                                        },
                                    ]}
                                ></Tree>
                            </div>
                            <div style={{position: 'absolute', top: 20, right: 100, textAlign: 'center'}}>
                                ZONA GEOGRAFICA
                            </div>
                            <div style={{width: 200, margin: 'auto', marginTop: 50, height: 200, position: 'relative', 
                                    overflow: 'hidden', boxSizing: 'border-box'}}
                            >
                                <img src='/img/bolivia.png' alt='none' 
                                    style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
                                        width: '100%', height: '100%'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{width: '50%', padding: 10, border: '1px dashed black'}}>
                            <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                                <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>ANALISIS REALIZADO</strong>
                            </div>
                            <div style={{width: '100%', padding: 10, display: 'block'}}>
                                <div style={{width: 250, height: 150, margin: 'auto', marginTop: 5, position: 'relative'}}>
                                    <img src='/img/cuadro3.jpg'  
                                        style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%'}}
                                    />
                                </div>
                                <div style={{width: '100%', margin: 'auto', marginTop: 5, display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
                                    <div>
                                        <label>Cantidad Admision: ####</label>
                                    </div>
                                    <div>
                                        <label>Cantidad atencion: ####</label>
                                    </div>
                                </div>
                            </div>
                            <div style={{width: '100%', padding: 10, textAlign: 'center'}}>
                                <strong style={{fontFamily: 'Roboto', fontSize: 20,}}>ANALISIS REALIZADO</strong>
                            </div>
                            <div style={{width: '100%', padding: 10, display: 'block'}}>
                                <div style={{width: 250, height: 150, margin: 'auto', marginTop: 5, position: 'relative'}}>
                                    <img src='/img/cuadro3.jpg'  
                                        style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%'}}
                                    />
                                </div>
                                <div style={{width: '100%', margin: 'auto', marginTop: 5, display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
                                    <div>
                                        <label>Monto Adeudado: ####</label>
                                    </div>
                                    <div>
                                        <label>Monto Total: ####</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
);

