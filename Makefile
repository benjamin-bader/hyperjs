OUTDIR=bin
LIB=$(OUTDIR)/hyper.js
CATTED=bin/catted.js
SPECS = $(shell ls spec/*.js)

CLEVEL = SIMPLE_OPTIMIZATIONS
CFLAGS = --compilation-level=$(CLEVEL) --js_output_file=$(LIB)
COMPILE = closure-compiler $(CFLAGS)

FILES := common.js trie.js script/tokens.js script/reader.js script/lexer.js
SOURCES := $(addprefix src/,$(FILES))

clean:
	@if [ -d $(OUTDIR) ]; then rm -rf $(OUTDIR); fi

all: test
	$(COMPILE) --js 

build: $(LIB)

$(LIB): $(addprefix --js ,$(SOURCES)) | $(OUTDIR)
	$(COMPILE) $<

test: $(CATTED) $(SPECS)
	for FILE in $(SPECS); do > test.js; cat $(CATTED) > test.js; cat $$FILE >> test.js; jasmine-headless-webkit test.js && rm test.js; done

$(CATTED): $(SOURCES) | $(OUTDIR)
	@> $@
	@for FILE in $(SOURCES); do cat $$FILE >> $@; done

$(OUTDIR):
	test -d $@ || mkdir $@

