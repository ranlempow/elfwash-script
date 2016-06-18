# ModelView (MVC)


## Member

### Member.typeName
���ҫ����ݫ��O���W��.

### Member.typeLable
���ҫ����ݫ��O����ܦW��.

### Member.**importants**
Type: Array
�ݭn�[�j��ܪ����n�ݩʦW�٦C��.

### Member.**alias**
Type: Object
�U�ݩʪ���ܦW��.

### Member.**getTitle**()

��^��ܼ��D.
�i�H�^�Ǵ��q�r��, jQuery����.

### Member.**getIcon**()
��^��ܹϥ�.
�i�H�^�Ǵ��q�r��, jQuery����.


## GroupView
### GroupView.**name**
### GroupView.**viewLable**
### GroupView.**modelClass**     
### GroupView.**cmds**

### Command.label
### Command.targets
### Command.prompt
### Command.execute


### GroupView.**co**



## Collection

�P�@��Collection���u���x�s�ۦP�@�ӫ��O��Model.
Collection���򥻥\�౵��ڭ̩ҿת��e��.

### Collection.**add**(models)
models: Object, Model, Array
�Ѽ�models�i�H�O�@�ӥ]�t�Ҧ��ݩʪ��r��, �άO�@�Ӽҫ�����.
�p�Gmodels�O�@�ӦC��, �h�C���C�Ӥ������O�W�z��ث��O���䤤�@��.
**add**�|�N�C�Ӫ���[�J��Collection��, �o�|�ھ�model.id�ӧP�_�Ӫ���O�_�w�g�s�b.
�p�G�Ӽҫ�����w�g�s�bCollection����, �h�N�ҫ����ݩʧ�s.

### Collection.**set**(models)
models: Object, Model, Array
�Ѽ�models�������P**add**�ۦP.
���s�]�w���Collection�����e��.
����k�P**add**�D�`�ۦ�, �ߤ@���t�O�b��**set**�|����Collection�����s�b��Ѽ�models������.

### Collection.**remove**(models)
models: Object, String, Model, Array
�Ѽ�models�������P**add**�j�P�ۦP, �h�F�@�Ӧr�ꫬ�O�H��F���w��model.id.
�qCollection�������Ҧ��ŦX������.


### Collection.**get**(id)
�qCollection�����o���wid��model����.

### Collection.**size**()
��^Collection�ҧt������ƶq.

### Collection.**each**(iteratee)
iteratee: Function(value, index)

### Collection.**where**(attributes)
attributes: Object

### Collection.**filter**(predicate)
predicate: Function(value)
