# Logging

## �O��������

�ѷL�p�쭫�j�����H�U�X��

### logging.**TRACE**
���Ѱ���W�̦h�Ӹ`����T

### logging.**DEBUG**
�i�Ѱ������ԲӸ�T

### logging.**INFO**
�@�몺���n�ʸ�T, �o�O�̴��q������

### logging.**WRAN**
�ȱo�`�N�ӥB�i��y���ˮ`�����ƥ�

### logging.**ERROR**
����ɾD�J����~.

### logging.**FATAL**
����ɾD�J�줣�i��_���Y�����~.


## ��API

tag�q�`�N��ƥ�o�ͦa�I�άO���ݪ�����. �W�L�@�ӥH�W��tag�i�H��'.'�Ӥ��j
message�i�H�O�r��άO���N����
time�N��o�ͪ��C���ɶ�, �i�H�����w.

logging(level, tag, message[, time])
logging.**trace**(tag, message[, time])
logging.**debug**(tag, message[, time])
logging.**info**(tag, message[, time])
logging.**warn**(tag, message[, time])
logging.**error**(tag, message[, time])
logging.**fatal**(tag, message[, time])

## �w�g�M�w�nTag��������

### logging.**getLogger**(tag)
#### tag
Type: String

�إ߰_�j�w�S�wtag���������ê�^�s�إߪ�������.
�o�ӰO�����Plogging���ۤ@�˪�����, ���F���Ϋ��wtag�ѼƥH�~, �ѤU�����@�Ҥ@��.

### Logger(level, message[, time])
### Logger.**trace**(message[, time])
### Logger.**debug**(message[, time])
### Logger.**info**(message[, time])
### Logger.**warn**(message[, time])
### Logger.**error**(message[, time])
### Logger.**fatal**(message[, time])

�d��
```javascript
var logging = logging.getLogger('mypkg.mytag');
logging.info('hello');
```
