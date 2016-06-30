box.cfg {listen = 3301}
		
box.schema.user.grant('guest', 'read, write, execute', 'universe')

s = box.schema.space.create('performance')
s:create_index('primary', {type = 'hash', parts={1,'NUM'}})		
